from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import csv
import os

router = APIRouter()

# ✅ Model
class Driver(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    status: str
    location: str
    vehicle: str
    safetyScore: int
    deliveries: int
    incidents: int
    lastActive: str
    joinDate: str
    certifications: List[str]
    riskLevel: str
    avatar: str = ""

# ✅ CSV path
CSV_FILE = os.path.join(os.path.dirname(__file__), "../data/drivers.csv")

# ✅ Read CSV utility
def read_drivers_from_csv() -> List[Driver]:
    drivers = []
    with open(CSV_FILE, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            drivers.append(
                Driver(
                    id=row["id"],
                    name=row["name"],
                    email=row["email"],
                    phone=row["phone"],
                    status=row["status"],
                    location=row["location"],
                    vehicle=row["vehicle"],
                    safetyScore=int(row["safetyScore"]),
                    deliveries=int(row["deliveries"]),
                    incidents=int(row["incidents"]),
                    lastActive=row["lastActive"],
                    joinDate=row["joinDate"],
                    certifications=row["certifications"].split(";") if row["certifications"] else [],
                    riskLevel=row["riskLevel"],
                    avatar=row.get("avatar", ""),
                )
            )
    return drivers

# ✅ GET: /api/drivers
@router.get("/", response_model=List[Driver])
def get_all_drivers():
    try:
        return read_drivers_from_csv()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="drivers.csv file not found")
