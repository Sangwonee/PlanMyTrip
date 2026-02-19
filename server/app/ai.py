import os
import json
import re
from datetime import datetime, timedelta
from typing import List, Union, Tuple

from openai import OpenAI

from app.schemas import PlaceCandidate, ResponseDto

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def _normalize_date_str(s: str) -> str:
    # "2025. 12. 09" -> "2025-12-09"
    s = (s or "").strip()
    s = s.replace(".", "-")
    s = re.sub(r"\s+", "", s)
    s = re.sub(r"-{2,}", "-", s)
    return s


def _parse_date_range(date_str: str) -> Tuple[str, str]:
    s = _normalize_date_str(date_str)
    if not s:
        return "", ""
    if "~" in s:
        a, b = s.split("~", 1)
        return a.strip(), b.strip()
    return s.strip(), ""


def _date_list(start: str, end: str) -> List[str]:
    if not start:
        return []
    try:
        s = datetime.strptime(start, "%Y-%m-%d")
    except ValueError:
        return []
    if not end:
        return [start]
    try:
        e = datetime.strptime(end, "%Y-%m-%d")
    except ValueError:
        return [start]
    if e < s:
        return [start]
    days = []
    cur = s
    while cur <= e and len(days) < 10:
        days.append(cur.strftime("%Y-%m-%d"))
        cur += timedelta(days=1)
    return days


def _sort_candidates(places: List[PlaceCandidate]) -> List[PlaceCandidate]:
    """
    이미지가 있는 장소를 우선으로 정렬.
    이미 조회순(arrange=B)으로 받아왔으므로 그 순서를 최대한 유지하면서
    이미지 없는 장소를 뒤로 밀어냄.
    """
    with_image = [p for p in places if p.firstimage]
    without_image = [p for p in places if not p.firstimage]
    return with_image + without_image


def build_plan_from_front(
    *,
    user_input: str,
    date_str: str,
    region: str,
    travel_type: Union[str, List[str]],
    transportation: str,
    places: List[PlaceCandidate],
) -> ResponseDto:
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set")

    start_date, end_date = _parse_date_range(date_str)
    dates = _date_list(start_date, end_date)

    # travelType 표준화(프롬프트용)
    if isinstance(travel_type, list):
        travel_types = [str(x).strip() for x in travel_type if str(x).strip()]
    else:
        travel_types = [x.strip() for x in str(travel_type or "").split(",") if x.strip()]

    # 이미지 있는 장소 우선 정렬 후 상위 60개 후보 추출
    sorted_places = _sort_candidates(places)

    candidates = []
    for p in sorted_places[:60]:
        candidates.append(
            {
                "title": p.title,
                "address": p.addr1,
                "image": p.firstimage,   # 빈 문자열이면 GPT가 낮은 우선순위로 처리
                "latitude": p.mapy,
                "longitude": p.mapx,
            }
        )

    system = (
        "너는 감성 힐링 여행 플래너다.\n"
        "반드시 입력 받은 지역(region)과 날짜(date_range)를 지켜서 일정을 만든다.\n"
        "반드시 candidates 목록 안의 title만 장소로 사용한다(목록 밖 장소 금지).\n"
        "반환은 오직 JSON만 출력한다(설명 문장/마크다운 금지).\n"
        "JSON 스키마는 response_schema를 따른다.\n"
    )

    response_schema = {
        "text": "string",
        "travelSchedule": [
            {
                "day": "Day 1",
                "date": "YYYY-MM-DD",
                "plan": [
                    {
                        "order": 1,
                        "place": "string (must match candidates.title)",
                        "description": "string",
                        "activity": "string",
                        "address": "string",
                        "image": "string",
                        "latitude": 0.0,
                        "longitude": 0.0,
                    }
                ],
            }
        ],
    }

    user_payload = {
        "region": region,
        "date_range": {"start": start_date, "end": end_date},
        "travelTypes": travel_types,
        "transportation": transportation,
        "userInput": user_input,
        "candidates": candidates,
        "response_schema": response_schema,
        "rules": [
            "place는 candidates.title 중 하나여야 함",
            "latitude/longitude는 해당 후보의 좌표를 그대로 사용",
            "1박 이상이면 숙소 1개 포함",
            "일정은 너무 빡빡하지 않게 — 하루 3~4곳 이내",
            "userInput의 키워드와 분위기를 최우선으로 반영하여 place를 선택할 것",
            "travelTypes에 맞지 않는 장소는 제외할 것",
            "image 필드가 비어 있는 candidates는 image가 있는 candidates보다 낮은 우선순위로 선택",
            "transportation이 '대중교통'이면 이동 거리가 짧고 접근성 좋은 장소 우선 선택",
            "transportation이 '자가용'이면 드라이브 코스, 외곽 명소도 포함 가능",
        ],
        "date_hint_list": dates,
    }

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.4,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False)},
        ],
    )

    content = resp.choices[0].message.content or "{}"
    data = json.loads(content)

    # 날짜 덮어쓰기(모델이 이상한 연도 쓰는 걸 방지)
    if dates and isinstance(data.get("travelSchedule"), list):
        for i, d in enumerate(data["travelSchedule"]):
            if isinstance(d, dict) and i < len(dates):
                d["day"] = d.get("day") or f"Day {i+1}"
                d["date"] = dates[i]

    # 장소명 기반으로 좌표/주소/이미지 보정(모델 실수 방지)
    place_map = {p.title: p for p in places}
    for d in data.get("travelSchedule", []):
        for plan in d.get("plan", []):
            title = plan.get("place", "")
            cand = place_map.get(title)
            if cand:
                plan["latitude"] = float(cand.mapy or 0.0)
                plan["longitude"] = float(cand.mapx or 0.0)
                if not plan.get("address"):
                    plan["address"] = cand.addr1 or ""
                if not plan.get("image"):
                    plan["image"] = cand.firstimage or ""

    return ResponseDto.model_validate(data)
