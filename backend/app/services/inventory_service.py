import csv
import os
from app.config import settings

def get_inventory_status():
    file_path = os.path.join(settings.DATA_DIR, "inventory.csv")
    inventory = []

    try:
        with open(file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                inventory.append(row)
        return {"status": "success", "inventory": inventory}
    except FileNotFoundError:
        return {"status": "error", "message": "Inventory file not found"}
