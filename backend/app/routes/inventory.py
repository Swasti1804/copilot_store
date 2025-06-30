from fastapi import APIRouter
from app.config import settings
import os
import csv
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/status")
def get_inventory_status():
    inventory_file = settings.inventory_file_path()
    full_path = os.path.abspath(inventory_file)
    
    print("📦 Checking inventory at:", full_path)

    # Check if file exists
    if not os.path.exists(full_path):
        print("❌ Inventory file not found at:", full_path)
        return JSONResponse(
            status_code=404,
            content={
                "status": "error",
                "message": f"Inventory file not found at {full_path}",
                "inventory": []
            }
        )

    inventory = []
    try:
        with open(full_path, mode="r", newline="", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            
            # Optional: Validate expected headers
            expected_headers = [
                "id", "name", "sku", "category", "currentStock",
                "minStock", "maxStock", "reorderPoint", "reorderQuantity",
                "location", "status", "price", "supplier", "supplierContact", "leadTime"
            ]

            missing_headers = [h for h in expected_headers if h not in reader.fieldnames]
            if missing_headers:
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "error",
                        "message": f"Missing headers in CSV: {', '.join(missing_headers)}",
                        "inventory": []
                    }
                )

            for row in reader:
                inventory.append(row)

        return {
            "status": "success",
            "inventory": inventory
        }

    except Exception as e:
        print("⚠️ Error reading inventory file:", str(e))
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "Failed to read inventory CSV.",
                "details": str(e),
                "inventory": []
            }
        )  