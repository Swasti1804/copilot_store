import pandas as pd
import os
from typing import Dict

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
INVENTORY_CSV = os.path.join(BASE_DIR, "data/inventory/inventory.csv")

REQUIRED_COLUMNS = [
    "id", "name", "sku", "category", "currentStock", "minStock",
    "maxStock", "reorderPoint", "reorderQuantity", "location",
    "status", "price", "supplier", "supplierContact", "leadTime"
]

def add_inventory_item(item_data: Dict[str, str]) -> str:
    try:
        df = pd.read_csv(INVENTORY_CSV)

        for col in REQUIRED_COLUMNS:
            if col not in item_data:
                return f"❌ Missing required field: {col}"

        new_row = pd.DataFrame([item_data])
        df = pd.concat([df, new_row], ignore_index=True)
        df.to_csv(INVENTORY_CSV, index=False)
        return "✅ Item added successfully to inventory."
    
    except Exception as e:
        return f"❌ Error adding item: {str(e)}"
