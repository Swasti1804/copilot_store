import pandas as pd
import os
from rapidfuzz import fuzz

# Base directory - adjust if needed
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))

INVENTORY_CSV = os.path.join(BASE_DIR, "data/inventory/inventory.csv")
REORDERS_CSV = os.path.join(BASE_DIR, "data/inventory/reorders.csv")

# Load CSVs once at module load
inventory_df = pd.read_csv(INVENTORY_CSV)
reorders_df = pd.read_csv(REORDERS_CSV)

def fuzzy_search(df: pd.DataFrame, question: str, threshold=50, max_results=3) -> list:
    question_lower = question.lower()
    matches = []

    for _, row in df.iterrows():
        row_text = " ".join(str(v).lower() for v in row.values)
        score = fuzz.token_set_ratio(question_lower, row_text)
        # Uncomment below to debug matching scores in console
        # print(f"Score for row '{row['name']}': {score}")
        if score >= threshold:
            matches.append((score, row))
    
    matches = sorted(matches, key=lambda x: x[0], reverse=True)
    return [row for _, row in matches[:max_results]]

def format_rows(rows: list) -> str:
    if not rows:
        return ""
    return "\n\n".join([row.to_string(index=False) for row in rows])

def answer_from_csv(question: str) -> str:
    question_lower = question.lower()

    if any(keyword in question_lower for keyword in ["stock", "inventory", "available", "quantity"]):
        results = fuzzy_search(inventory_df, question)
        if results:
            return "📦 Inventory Matches:\n" + format_rows(results)
        else:
            return "⚠️ No relevant inventory info found."

    elif any(keyword in question_lower for keyword in ["reorder", "restock", "order"]):
        results = fuzzy_search(reorders_df, question)
        if results:
            return "🔁 Reorder Matches:\n" + format_rows(results)
        else:
            return "⚠️ No relevant reorder info found."

    else:
        # If no keywords, search both datasets
        for df, label in [(inventory_df, "Inventory"), (reorders_df, "Reorders")]:
            results = fuzzy_search(df, question)
            if results:
                return f"🔍 Matches in {label}:\n" + format_rows(results)
        return "⚠️ No relevant info found in any dataset."
