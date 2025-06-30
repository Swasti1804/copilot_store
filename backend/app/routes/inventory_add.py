from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.inventory_service import add_inventory_item  # 👈 tu is file ko kahin aur rakh raha ho
import os

router = APIRouter()

@router.post("/add")
async def add_item_to_inventory(request: Request):
    try:
        item_data = await request.json()

        # 🧠 Call your helper function
        result = add_inventory_item(item_data)

        # 🔁 If result starts with ❌, return error
        if result.startswith("❌"):
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": result}
            )

        return {
            "status": "success",
            "message": result,
            "item": item_data
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "🚨 Server error while adding item.",
                "details": str(e)
            }
        )
