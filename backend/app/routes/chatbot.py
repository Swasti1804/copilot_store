from fastapi import APIRouter, Request
from app.services.csv_qa import answer_from_csv
from datetime import datetime
import traceback

router = APIRouter()

@router.post("/query")
async def ask_bot(request: Request):
    try:
        data = await request.json()
        question = data.get("question", "").strip()

        if not question:
            return {
                "question": None,
                "answer": "⚠️ No question provided.",
                "status": "error"
            }

        # ✅ Only CSV-based logic is used
        answer = answer_from_csv(question)

        return {
            "question": question,
            "answer": answer,
            "source": "csv_only",
            "status": "success",
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        traceback.print_exc()
        return {
            "question": None,
            "answer": "❌ CSV-based response failed.",
            "status": "error",
            "error": str(e)
        }
