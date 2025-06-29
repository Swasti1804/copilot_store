from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import inventory, drivers, sentiment, chatbot, weather

app = FastAPI(title="SmartStore Copilot")

# ✅ Enable CORS for frontend requests (like from localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set specific origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API route registrations
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(drivers.router, prefix="/api/drivers", tags=["Drivers"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])  # ⛅ don't touch

# ✅ Health check
@app.get("/")
def root():
    return {"message": "SmartStore Copilot API is running"}
