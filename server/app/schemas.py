from pydantic import BaseModel
from typing import List, Optional, Union


class FrontPlanRequest(BaseModel):
    userInput: str = ""
    date: str = ""  # "2025. 12. 09 ~ 2025. 12. 10" / "2025-12-09~2025-12-10" / "2025-12-09"
    region: str = ""  # "대구"
    travelType: Union[str, List[str]] = ""  # "관광,문화시설" or ["관광","문화시설"]
    transportation: str = ""
    companions: str = ""   # "혼자" | "커플" | "가족" | "친구들"
    pace: str = ""         # "여유롭게" | "보통" | "알차게"


class PlaceCandidate(BaseModel):
    title: str
    addr1: str = ""
    firstimage: str = ""
    mapy: float  # lat
    mapx: float  # lng
    contentid: Optional[str] = None
    contenttypeid: Optional[str] = None


class Plan(BaseModel):
    order: int
    place: str = ""
    description: str = ""
    activity: str = ""
    address: str = ""
    image: str = ""
    latitude: float = 0.0
    longitude: float = 0.0


class TravelDay(BaseModel):
    day: str
    date: str
    plan: List[Plan]


class ResponseDto(BaseModel):
    text: str = ""
    travelSchedule: List[TravelDay] = []
