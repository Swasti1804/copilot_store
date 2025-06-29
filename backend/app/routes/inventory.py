from fastapi import APIRouter
from app.config import settings
import os, csv

router = APIRouter()

@router.get("/status")
def get_inventory_status():
    inventory_file = settings.inventory_file_path()
    print("Looking for inventory at:", os.path.abspath(inventory_file))  # ✅ DEBUG line

    if not os.path.exists(inventory_file):
        return {"status": "error", "message": "Inventory file not found", "inventory": []}

    inventory = []
    with open(inventory_file, mode="r", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            inventory.append(row)

    return {"status": "success", "inventory": inventory}
