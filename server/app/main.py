from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import FrontPlanRequest, ResponseDto
from app.tourapi import area_based_list2
from app.ai import build_plan_from_front

from dotenv import load_dotenv
load_dotenv()



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


def _pick_area_code(region: str) -> int:
    return AREA_CODE.get((region or "").strip(), 6)  # 기본 부산


def _to_types(travelType) -> list[str]:
    if isinstance(travelType, list):
        return [str(x).strip() for x in travelType if str(x).strip()]
    return [x.strip() for x in str(travelType or "").split(",") if x.strip()]


def _pick_content_type_ids(travelType) -> list[int]:
    types = _to_types(travelType)
    return [TYPE_TO_CONTENTTYPEID[t] for t in types if t in TYPE_TO_CONTENTTYPEID]


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


@app.post("/v1/plan", response_model=ResponseDto)
def plan(req: FrontPlanRequest):
    try:
        area_code = _pick_area_code(req.region)
        ctype_ids = _pick_content_type_ids(req.travelType)

        places = []
        if ctype_ids:
            for ctid in ctype_ids:
                places.extend(area_based_list2(area_code=area_code, content_type_id=ctid, num_of_rows=25))
        else:
            places = area_based_list2(area_code=area_code, content_type_id=None, num_of_rows=50)

        places = _dedup(places)

        # 후보가 너무 적으면 넓게 한 번 더
        if len(places) < 10:
            places = _dedup(places + area_based_list2(area_code=area_code, content_type_id=None, num_of_rows=80))

        if not places:
            return ResponseDto(text="TourAPI에서 좌표 있는 장소 후보를 찾지 못했어요.", travelSchedule=[])

        return build_plan_from_front(
            user_input=req.userInput,
            date_str=req.date,
            region=req.region,
            travel_type=req.travelType,
            transportation=req.transportation,
            companions=req.companions,
            pace=req.pace,
            places=places,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
