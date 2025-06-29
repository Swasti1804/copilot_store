from fastapi import APIRouter
from typing import List
import csv
import os
from pydantic import BaseModel
from app.config import settings

router = APIRouter()

class Reorder(BaseModel):
    id: str
    itemId: str
    itemName: str
    supplier: str
    quantity: int
    estimatedCost: float
    urgency: str
    requestedBy: str
    requestedDate: str
    status: str
    notes: str

@router.get("/api/reorders", response_model=List[Reorder])
def get_reorders():
    filepath = os.path.join(settings.DATA_DIR, "reorders.csv")
    reorders = []
    with open(filepath, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            reorders.append(Reorder(
                id=row["id"],
                itemId=row["itemId"],
                itemName=row["itemName"],
                supplier=row["supplier"],
                quantity=int(row["quantity"]),
                estimatedCost=float(row["estimatedCost"]),
                urgency=row["urgency"],
                requestedBy=row["requestedBy"],
                requestedDate=row["requestedDate"],
                status=row["status"],
                notes=row["notes"]
            ))
    return reorders
