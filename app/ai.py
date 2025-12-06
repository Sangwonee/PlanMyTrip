import json
from datetime import datetime
from typing import List
from openai import OpenAI
from app.schemas import PlanMyTripRequest, ResponseDto, PlaceCandidate

client = OpenAI()

SYSTEM = """
너는 PlanMyTrip 여행 플래너다.

규칙:
- 반드시 "JSON만" 출력한다. (마크다운/설명/일반 문장 금지)
- 출력은 아래 ResponseDto 형태를 정확히 따른다:
{
  "text": string,
  "travelSchedule": [
    {
      "day": string,
      "date": string,
      "plan": [
        {
          "order": number,
          "place": string,
          "description": string,
          "activity": string,
          "address": string,
          "image": string,
          "latitude": number,
          "longitude": number
        }
      ]
    }
  ]
}
- place/address/image/latitude/longitude는 제공된 후보 목록에서만 사용한다. (새 장소 생성 금지)
- 일정은 여유롭게 구성한다. (Day당 4~6개)
""".strip()

def _dates_between(start: str, end: str) -> List[str]:
    if not start and not end:
        return [""]
    if start and not end:
        return [start]
    if end and not start:
        return [end]

    s = datetime.strptime(start, "%Y-%m-%d")
    e = datetime.strptime(end, "%Y-%m-%d")
    if e < s:
        s, e = e, s

    out = []
    cur = s
    while cur <= e:
        out.append(cur.strftime("%Y-%m-%d"))
        cur = cur.fromordinal(cur.toordinal() + 1)
    return out

def build_plan(req: PlanMyTripRequest, places: List[PlaceCandidate]) -> ResponseDto:
    dates = _dates_between(req.start_date, req.end_date)

    # 모델에게 줄 후보(비용/길이 제한)
    places_payload = [
        {
            "title": p.title,
            "addr1": p.addr1,
            "firstimage": p.firstimage,
            "mapy": p.mapy,
            "mapx": p.mapx,
        }
        for p in places[:30]
    ]

    prompt = f"""
[여행 조건]
- 기간: {req.start_date} ~ {req.end_date}
- 여행지: {req.destination}
- 유형: {", ".join(req.travel_types) if req.travel_types else "미선택"}
- 이동수단: {req.transportation}
- 추가요청: {req.user_input}

[장소 후보(JSON) - 이 목록에서만 선택]
{json.dumps(places_payload, ensure_ascii=False)}

요청:
- travelSchedule는 {len(dates)}일치로 구성해.
- 각 day의 plan은 order를 1부터 증가시키고, 4~6개로 여유롭게.
- plan의 place는 title, address는 addr1, image는 firstimage,
  latitude는 mapy, longitude는 mapx를 그대로 넣어.
- 최종 출력은 JSON만.
""".strip()

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )

    content = resp.choices[0].message.content or ""

    # 혹시 코드블록으로 감싸서 줄 수도 있어서 제거
    content = content.strip()
    if content.startswith("```"):
        content = content.strip("`")
        # "json\n{...}" 형태 제거
        if content.lower().startswith("json"):
            content = content[4:].strip()

    data = json.loads(content)

    # date/day 보정(모델이 비워둘 수 있음)
    if isinstance(data.get("travelSchedule"), list):
        for i, d in enumerate(data["travelSchedule"]):
            if isinstance(d, dict):
                d.setdefault("day", f"Day {i+1}")
                if not d.get("date") and i < len(dates):
                    d["date"] = dates[i]

    return ResponseDto.model_validate(data)
