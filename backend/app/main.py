from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Import route modules
from app.routes import (
    inventory,
    inventory_add,
    reorders,
    drivers,
    sentiment,
    chatbot,
    weather,
    incidents,
    voice,
    drivers  # ✅ New: driver CSV route
)

# ✅ Initialize app
app = FastAPI(title="SmartStore Copilot")

# ✅ Enable CORS for frontend (React or others)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use exact origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register route modules with prefixes
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(inventory_add.router, prefix="/api/inventory", tags=["Inventory Add"])
app.include_router(reorders.router, prefix="/api/reorders", tags=["Reorders"])
app.include_router(drivers.router, prefix="/api/drivers", tags=["Drivers (Static)"])
app.include_router(drivers.router, prefix="/api/driver", tags=["Driver CSV"])  # ✅ CSV-driven driver data
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice Assistant"])

# ✅ Root health check
@app.get("/")
def root():
    return {"message": "SmartStore Copilot API is running ✅"}
