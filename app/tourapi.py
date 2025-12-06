import os
import requests
from typing import List, Optional
from app.schemas import PlaceCandidate

TOURAPI_KEY = os.getenv("TOURAPI_SERVICE_KEY", "")
BASE_URL = "https://apis.data.go.kr/B551011/KorService2"

def _normalize_items(data):
    items = data.get("response", {}).get("body", {}).get("items", {}).get("item", [])
    if isinstance(items, dict):
        return [items]
    return items if isinstance(items, list) else []

def area_based_list2(
    area_code: int,
    content_type_id: Optional[int] = None,
    arrange: str = "A",
    cat1: Optional[str] = None,
    cat2: Optional[str] = None,
    cat3: Optional[str] = None,
    num_of_rows: int = 30,
    page_no: int = 1,
) -> List[PlaceCandidate]:
    """
    TourAPI areaBasedList2로 지역 기반 후보(좌표 포함) 가져오기
    """
    if not TOURAPI_KEY:
        raise RuntimeError("TOURAPI_SERVICE_KEY is not set")

    url = f"{BASE_URL}/areaBasedList2"
    params = {
        "serviceKey": TOURAPI_KEY,
        "MobileApp": "PlanMyTrip",
        "MobileOS": "ETC",
        "_type": "json",
        "arrange": arrange,
        "areaCode": int(area_code),
        "numOfRows": int(num_of_rows),
        "pageNo": int(page_no),
    }

    # 선택 파라미터는 값 있을 때만 넣기
    if content_type_id is not None:
        params["contentTypeId"] = int(content_type_id)
    if cat1:
        params["cat1"] = cat1
    if cat2:
        params["cat2"] = cat2
    if cat3:
        params["cat3"] = cat3

    r = requests.get(url, params=params, timeout=10)
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
            continue

        if mapy == 0.0 or mapx == 0.0:
            continue

        out.append(
            PlaceCandidate(
                title=title,
                addr1=(it.get("addr1") or "").strip(),
                firstimage=(it.get("firstimage") or "").strip(),
                mapy=mapy,
                mapx=mapx,
                contentid=str(it.get("contentid")) if it.get("contentid") else None,
                contenttypeid=str(it.get("contenttypeid")) if it.get("contenttypeid") else None,
            )
        )

    return out
