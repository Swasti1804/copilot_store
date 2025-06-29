from fastapi import APIRouter
from app.services.driver_risk_service import get_driver_risks

router = APIRouter()

@router.get("/risk")
def driver_risk():
    return get_driver_risks()
