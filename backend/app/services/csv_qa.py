import pandas as pd
import os
from rapidfuzz import fuzz

# ✅ Base directory - adjust if needed
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
INVENTORY_CSV = os.path.join(BASE_DIR, "data/inventory/inventory.csv")
REORDERS_CSV = os.path.join(BASE_DIR, "data/inventory/reorders.csv")

# ✅ Load data once
inventory_df = pd.read_csv(INVENTORY_CSV)
reorders_df = pd.read_csv(REORDERS_CSV)

def fuzzy_search(df: pd.DataFrame, question: str, threshold=50, max_results=3) -> list:
    question_lower = question.lower()
    matches = []
    for _, row in df.iterrows():
        row_text = " ".join(str(v).lower() for v in row.values)
        score = fuzz.token_set_ratio(question_lower, row_text)
        if score >= threshold:
            matches.append((score, row))
    matches = sorted(matches, key=lambda x: x[0], reverse=True)
    return [row for _, row in matches[:max_results]]

def format_rows(rows: list) -> str:
    if not rows:
        return ""
    return "\n\n".join([row.to_string(index=False) for row in rows])

def answer_from_csv(question: str) -> str:
    q = question.lower().strip()

    # ✅ Full list queries
    if any(x in q for x in ["show all inventory", "full inventory", "entire inventory", "show full stock", "list inventory"]):
        return "📦 Full Inventory:\n" + inventory_df.to_string(index=False)

    if any(x in q for x in ["show all reorders", "full reorder", "entire reorder", "list reorders"]):
        return "🔁 Full Reorder List:\n" + reorders_df.to_string(index=False)

    # ✅ Inventory-specific search
    if any(k in q for k in ["stock", "inventory", "available", "quantity", "status", "price", "location", "supplier", "lead time"]):
        matches = fuzzy_search(inventory_df, q)
        if matches:
            return "📦 Inventory Matches:\n" + format_rows(matches)
        else:
            return "⚠️ No relevant inventory info found."

    # ✅ Reorder-specific search
    if any(k in q for k in ["reorder", "restock", "order", "urgent", "requested", "estimated cost", "delivered"]):
        matches = fuzzy_search(reorders_df, q)
        if matches:
            return "🔁 Reorder Matches:\n" + format_rows(matches)
        else:
            return "⚠️ No relevant reorder info found."

    # 🔍 Fallback to both
    for df, label in [(inventory_df, "Inventory"), (reorders_df, "Reorders")]:
        matches = fuzzy_search(df, q)
        if matches:
            return f"🔍 Matches in {label}:\n" + format_rows(matches)

    return "⚠️ No relevant info found in any dataset."
