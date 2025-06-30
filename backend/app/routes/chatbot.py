from fastapi import APIRouter, Request
from app.services.csv_qa import answer_from_csv

router = APIRouter()

@router.post("/query")
async def ask_bot(request: Request):
    data = await request.json()
    question = data.get("question", "")

    try:
        answer = answer_from_csv(question)
        return {
            "question": question,
            "answer": answer
        }
    except Exception as e:
        return {
            "question": question,
            "answer": "❌ CSV-based response failed.",
            "error": str(e)
        }
