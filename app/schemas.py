from pydantic import BaseModel, Field
from typing import List, Optional

class PlanMyTripRequest(BaseModel):
    start_date: str = ""          # "2025-12-20"
    end_date: str = ""            # "2025-12-21"
    destination: str = ""         # "부산"
    travel_types: List[str] = Field(default_factory=list)  # ["관광","문화시설","쇼핑"]
    transportation: str = ""      # "대중교통"
    user_input: str = ""          # 자유 입력

class PlaceCandidate(BaseModel):
    title: str
    addr1: str = ""
    firstimage: str = ""
    mapy: float = 0.0  # latitude(위도)
    mapx: float = 0.0  # longitude(경도)
    contentid: Optional[str] = None
    contenttypeid: Optional[str] = None

class Plan(BaseModel):
    order: int
    place: str
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
    text: str
    travelSchedule: List[TravelDay]
