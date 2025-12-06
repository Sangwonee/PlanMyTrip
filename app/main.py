from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import PlanMyTripRequest, ResponseDto
from app.tourapi import area_based_list2
from app.ai import build_plan

app = FastAPI(title="PlanMyTrip")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://plan-my-trip-bucket.s3-website.ap-northeast-2.amazonaws.com",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

AREA_CODE = {
    "서울": 1, "인천": 2, "대전": 3, "대구": 4, "광주": 5, "부산": 6, "울산": 7, "세종": 8,
    "경기": 31, "강원": 32, "충북": 33, "충남": 34, "경북": 35, "경남": 36, "전북": 37, "전남": 38, "제주": 39,
}

TYPE_TO_CONTENTTYPEID = {
    "관광": 12,
    "문화시설": 14,
    "쇼핑": 38,
    "숙박": 32,
    "음식점": 39,
}

def _pick_area_code(destination: str) -> int:
    dest = (destination or "").strip()
    return AREA_CODE.get(dest, 6)  # 기본 부산

def _pick_content_type_ids(travel_types):
    ids = []
    for t in (travel_types or []):
        if t in TYPE_TO_CONTENTTYPEID:
            ids.append(TYPE_TO_CONTENTTYPEID[t])
    return ids  # 없으면 []

def _dedup(places):
    seen = set()
    out = []
    for p in places:
        key = p.contentid or f"{p.title}|{p.mapy}|{p.mapx}"
        if key in seen:
            continue
        seen.add(key)
        out.append(p)
    return out

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/v1/tourapi-test")
def tourapi_test(area: str = "부산"):
    area_code = _pick_area_code(area)
    places = area_based_list2(area_code=area_code, num_of_rows=10)
    return [p.model_dump() for p in places]

@app.post("/v1/plan", response_model=ResponseDto)
def plan(req: PlanMyTripRequest):
    try:
        area_code = _pick_area_code(req.destination)
        ctype_ids = _pick_content_type_ids(req.travel_types)

        places = []

        # 1) 타입 선택이 있으면 타입별 호출 후 합치기
        if ctype_ids:
            for ctid in ctype_ids:
                places.extend(area_based_list2(area_code=area_code, content_type_id=ctid, num_of_rows=25))
        else:
            # 2) 타입 선택이 없으면 넓게 한 번
            places = area_based_list2(area_code=area_code, content_type_id=None, num_of_rows=50)

        places = _dedup(places)

        # 후보가 너무 적으면 넓게 한번 더
        if len(places) < 10:
            places = _dedup(places + area_based_list2(area_code=area_code, content_type_id=None, num_of_rows=80))

        if not places:
            return ResponseDto(text="TourAPI에서 좌표 있는 장소 후보를 찾지 못했어요.", travelSchedule=[])

        # 3) OpenAI로 일정을 ResponseDto로 생성
        return build_plan(req, places)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
