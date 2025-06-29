
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/query")
async def ask_bot(request: Request):
    data = await request.json()
    question = data.get("question", "")

    # Dummy answer for now
    return {
        "question": question,
        "answer": f"'{question}' ka jawab AI se aa raha hai (demo response)."
    }
