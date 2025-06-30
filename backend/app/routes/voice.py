# app/routes/voice.py
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class VoiceCommand(BaseModel):
    query: str

@router.post("/command")
async def handle_voice_command(data: VoiceCommand):
    query = data.query.lower()

    if "inventory" in query:
        # Example hardcoded items with status
        inventory_status = [
            "Laptop Pro is in stock",
            "Smartphone X is out of stock",
            "Office Chair is in stock",
            "Desk Lamp is in stock"
        ]
        
        # Suggest reorder for out-of-stock items
        reorder_suggestion = "Please reorder Smartphone X."

        full_reply = (
            "Here is your current inventory status: "
            + ". ".join(inventory_status)
            + ". "
            + reorder_suggestion
        )

        return {"reply": full_reply}

    elif "reorder" in query:
        return {"reply": "Reorder request has been placed."}

    else:
        return {"reply": "Sorry, I didn’t understand that."}
