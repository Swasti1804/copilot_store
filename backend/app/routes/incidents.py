from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter()

# Mock DB
incidents = []

# Incident model
class Incident(BaseModel):
    id: str
    driverId: str
    driverName: str
    type: str
    severity: str  # "minor", "moderate", "severe"
    description: str
    date: str
    status: str  # "reported", "investigating", "resolved"
    location: str

# ✅ GET all incidents
@router.get("/", response_model=List[Incident])
def get_all_incidents():
    return incidents

# ✅ POST add new incident
@router.post("/", response_model=Incident)
def create_incident(incident: Incident):
    incidents.append(incident)
    return incident

# ✅ PATCH to update status (e.g., mark resolved)
@router.patch("/{incident_id}/resolve", response_model=Incident)
def resolve_incident(incident_id: str):
    for incident in incidents:
        if incident["id"] == incident_id:
            incident["status"] = "resolved"
            return incident
    raise HTTPException(status_code=404, detail="Incident not found")
