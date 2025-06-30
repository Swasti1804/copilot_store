import pandas as pd
import os
from typing import Dict

# 📂 CSV file path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
INVENTORY_CSV = os.path.join(BASE_DIR, "data/inventory/inventory.csv")

# ✅ Required columns for inventory
REQUIRED_COLUMNS = [
    "id", "name", "sku", "category", "currentStock", "minStock",
    "maxStock", "reorderPoint", "reorderQuantity", "location",
    "status", "price", "supplier", "supplierContact", "leadTime"]

def add_inventory_item(item_data: Dict[str, str]) -> str:
    try:
        # ✅ Load existing CSV
        df = pd.read_csv(INVENTORY_CSV)

        # ✅ Check all required columns exist
        for col in REQUIRED_COLUMNS:
            if col not in item_data:
                return f"❌ Missing required field: {col}"

        # ✅ Convert to DataFrame and append
        new_row = pd.DataFrame([item_data])
        df = pd.concat([df, new_row], ignore_index=True)

        # ✅ Save updated CSV
        df.to_csv(INVENTORY_CSV, index=False)
        return "✅ Item added successfully to inventory."
    
    except Exception as e:
        return f"❌ Error adding item: {str(e)}"
