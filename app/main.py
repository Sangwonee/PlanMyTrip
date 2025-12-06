from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="PlanMyTrip")
app.include_router(router)

@app.get("/health")
def health():
    return {"ok": True}
