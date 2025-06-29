from fastapi import APIRouter, Query
from app.services.weather_service import fetch_weather

router = APIRouter()

@router.get("/")
def get_weather(city: str = Query(..., description="City name to check weather")):
    return fetch_weather(city)
