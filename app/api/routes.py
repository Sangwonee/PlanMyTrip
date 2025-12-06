from fastapi import APIRouter

router = APIRouter(prefix="/v1")

@router.get("/plan")
def make_plan(city: str, days: int = 3, style: str = "balanced"):
    # TODO: 나중에 여기서 AI로 itinerary 생성
    return {
        "city": city,
        "days": days,
        "style": style,
        "itinerary": [
            {"day": 1, "title": "Arrival + city walk"},
            {"day": 2, "title": "Top highlights"},
            {"day": 3, "title": "Food + shopping"},
        ],
    }
