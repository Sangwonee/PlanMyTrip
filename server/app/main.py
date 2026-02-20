from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import re

load_dotenv()

from app.schemas import FrontPlanRequest, PlaceCandidate, ResponseDto
from app.tourapi import area_based_list2
from app.ai import (
    apply_schedule_edit_locally,
    build_plan_from_front,
    has_add_intent,
    has_edit_intent,
    has_replan_intent,
)

app = FastAPI(title="PlanMyTrip")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://plandl.s3-website.ap-northeast-2.amazonaws.com",
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
    "관광지": 12,
    "문화시설": 14,
    "문화": 14,
    "축제공연행사": 15,
    "축제": 15,
    "공연": 15,
    "행사": 15,
    "쇼핑": 38,
    "숙박": 32,
    "음식점": 39,
    "음식": 39,
    "맛집": 39,
}


def _pick_area_code(region: str) -> int:
    return AREA_CODE.get((region or "").strip(), 6)  # 기본 부산


def _to_types(travelType) -> list[str]:
    if isinstance(travelType, list):
        return [str(x).strip() for x in travelType if str(x).strip()]
    return [x.strip() for x in str(travelType or "").split(",") if x.strip()]


def _normalize_type_label(type_label: str) -> str:
    return re.sub(r"[\s/]+", "", (type_label or "").strip().lower())


def _pick_content_type_ids(travelType) -> list[int]:
    out = []
    seen = set()
    for type_name in _to_types(travelType):
        content_type_id = TYPE_TO_CONTENTTYPEID.get(_normalize_type_label(type_name))
        if content_type_id is None or content_type_id in seen:
            continue
        seen.add(content_type_id)
        out.append(content_type_id)
    return out


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


def _schedule_to_candidates(current_schedule):
    out = []
    for day in current_schedule:
        for item in day.plan:
            title = (item.place or "").strip()
            if not title:
                continue

            out.append(
                PlaceCandidate(
                    title=title,
                    addr1=(item.address or "").strip(),
                    firstimage=(item.image or "").strip(),
                    mapy=float(item.latitude or 0.0),
                    mapx=float(item.longitude or 0.0),
                )
            )
    return out


def _collect_places(area_code: int, ctype_ids: list[int], min_candidates: int = 12):
    places = []

    if ctype_ids:
        for ctid in ctype_ids:
            places.extend(
                area_based_list2(
                    area_code=area_code,
                    content_type_id=ctid,
                    num_of_rows=30,
                )
            )
        places = _dedup(places)

        if len(places) < min_candidates:
            for ctid in ctype_ids:
                places.extend(
                    area_based_list2(
                        area_code=area_code,
                        content_type_id=ctid,
                        num_of_rows=80,
                    )
                )
            places = _dedup(places)

        # 선택한 유형의 후보가 극단적으로 적을 때만 전체 유형으로 보강
        if len(places) < max(6, min_candidates // 2):
            places = _dedup(
                places
                + area_based_list2(
                    area_code=area_code,
                    content_type_id=None,
                    num_of_rows=80,
                )
            )
        return places

    places = area_based_list2(area_code=area_code, content_type_id=None, num_of_rows=50)
    places = _dedup(places)

    if len(places) < min_candidates:
        places = _dedup(
            places
            + area_based_list2(
                area_code=area_code,
                content_type_id=None,
                num_of_rows=80,
            )
        )

    return places


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/v1/plan", response_model=ResponseDto)
def plan(req: FrontPlanRequest):
    try:
        area_code = _pick_area_code(req.region)
        ctype_ids = _pick_content_type_ids(req.travelType)
        current_schedule = req.currentSchedule or []
        current_schedule_dict = [d.model_dump() for d in current_schedule]
        current_schedule_candidates = _dedup(_schedule_to_candidates(current_schedule))
        is_replan = has_replan_intent(req.userInput)

        # 기존 일정이 있을 때는 기본적으로 "수정 모드"로 처리해서 완전히 새 일정으로 바뀌지 않게 보호
        if current_schedule and not is_replan and has_edit_intent(req.userInput):
            local_edited = apply_schedule_edit_locally(
                user_input=req.userInput,
                current_schedule=current_schedule_dict,
                places=current_schedule_candidates,
            )
            if local_edited is not None:
                if (
                    has_add_intent(req.userInput)
                    and "추가 후보를 찾지 못함" in (local_edited.text or "")
                ):
                    fetched_places = _collect_places(area_code=area_code, ctype_ids=ctype_ids)
                    retry_edited = apply_schedule_edit_locally(
                        user_input=req.userInput,
                        current_schedule=current_schedule_dict,
                        places=_dedup(current_schedule_candidates + fetched_places),
                    )
                    if retry_edited is not None:
                        return retry_edited
                return local_edited

            return ResponseDto(
                text="수정 요청을 이해하지 못했어요. 예: '해운대 삭제', '2일차에 감천문화마을 추가'",
                travelSchedule=current_schedule_dict,
            )

        places = _collect_places(area_code=area_code, ctype_ids=ctype_ids)

        if current_schedule and not is_replan:
            places = _dedup(places + current_schedule_candidates)

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
            current_schedule=[] if is_replan else current_schedule_dict,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
