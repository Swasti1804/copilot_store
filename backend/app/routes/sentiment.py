from fastapi import APIRouter
from app.services.sentiment_service import analyze_sentiment

router = APIRouter()

@router.get("/reviews")
def get_sentiment():
    return analyze_sentiment()
