from fastapi import APIRouter, Request
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

# Configure Google Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

router = APIRouter()

@router.post("/query")
async def ask_bot(request: Request):
    data = await request.json()
    question = data.get("question", "")

    try:
        # Use Gemini model
        model = genai.GenerativeModel("models/gemini-pro")
        response = model.generate_content(question)

        return {
            "question": question,
            "answer": response.text
        }

    except Exception as e:
        return {
            "question": question,
            "answer": "❌ Gemini API failed.",
            "error": str(e)
        }
