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

    # 후보 장소 payload (모델은 이 중에서만 선택하게)
    candidates = []
    for p in places[:60]:
        candidates.append(
            {
                "title": p.title,
                "address": p.addr1,
                "image": p.firstimage,
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
            "일정은 너무 빡빡하지 않게",
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

    # ✅ 장소명 기반으로 좌표/주소/이미지 보정(모델 실수 방지)
    place_map = {p.title: p for p in places}
    for day in data.get("travelSchedule", []):
        # 날짜 강제 보정(날짜 리스트가 있으면 그걸로)
        # day 순서대로 date_hint_list 적용
        # (모델이 2023 같은 거 써도 덮어씀)
        pass

    # 날짜 덮어쓰기(모델이 이상한 연도 쓰는 걸 방지)
    if dates and isinstance(data.get("travelSchedule"), list):
        for i, d in enumerate(data["travelSchedule"]):
            if isinstance(d, dict) and i < len(dates):
                d["day"] = d.get("day") or f"Day {i+1}"
                d["date"] = dates[i]

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
