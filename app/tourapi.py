import os
import requests
from typing import List, Optional

from app.schemas import PlaceCandidate

BASE_URL = "https://apis.data.go.kr/B551011/KorService2"
TOURAPI_KEY = os.getenv("TOURAPI_SERVICE_KEY", "")


def _normalize_items(data) -> List[dict]:
    items = (
        data.get("response", {})
        .get("body", {})
        .get("items", {})
        .get("item", [])
    )
    if isinstance(items, dict):
        return [items]
    if isinstance(items, list):
        return items
    return []


def area_based_list2(
    *,
    area_code: int,
    content_type_id: Optional[int] = None,
    cat1: Optional[str] = None,
    cat2: Optional[str] = None,
    cat3: Optional[str] = None,
    arrange: str = "A",
    num_of_rows: int = 30,
    page_no: int = 1,
) -> List[PlaceCandidate]:
    """
    KorService2/areaBasedList2 호출.
    좌표(mapx/mapy) 포함 장소 후보 반환
    """
    if not TOURAPI_KEY:
        raise RuntimeError("TOURAPI_SERVICE_KEY is not set")

    url = f"{BASE_URL}/areaBasedList2"
    params = {
        "serviceKey": TOURAPI_KEY,
        "MobileOS": "ETC",
        "MobileApp": "PlanMyTrip",
        "_type": "json",
        "arrange": arrange,
        "areaCode": area_code,
        "numOfRows": num_of_rows,
        "pageNo": page_no,
    }
    if content_type_id is not None:
        params["contentTypeId"] = content_type_id
    if cat1:
        params["cat1"] = cat1
    if cat2:
        params["cat2"] = cat2
    if cat3:
        params["cat3"] = cat3

    r = requests.get(url, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()

    out: List[PlaceCandidate] = []
    for it in _normalize_items(data):
        title = (it.get("title") or "").strip()
        if not title:
            continue

        try:
            mapy = float(it.get("mapy") or 0.0)
            mapx = float(it.get("mapx") or 0.0)
        except ValueError:
            mapy, mapx = 0.0, 0.0

        # 지도 표시는 좌표가 필수 -> 없는 건 제외
        if mapy == 0.0 or mapx == 0.0:
            continue

        out.append(
            PlaceCandidate(
                title=title,
                addr1=(it.get("addr1") or "").strip(),
                firstimage=(it.get("firstimage") or "").strip(),
                mapy=mapy,
                mapx=mapx,
                contentid=str(it.get("contentid")) if it.get("contentid") is not None else None,
                contenttypeid=str(it.get("contenttypeid")) if it.get("contenttypeid") is not None else None,
            )
        )

    return out
