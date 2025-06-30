from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Import route modules from app.routes
from app.routes import (
    inventory,
    drivers,
    sentiment,
    chatbot,
    weather,
    reorders,
    incidents  # ✅ Incident route added
)

# ✅ Initialize FastAPI app
app = FastAPI(title="SmartStore Copilot")

# ✅ Allow frontend to connect (e.g., React at localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev use "*". For production, specify domain(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register route modules with appropriate prefixes and tags
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(drivers.router, prefix="/api/drivers", tags=["Drivers"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(reorders.router, prefix="/api/reorders", tags=["Reorders"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])

# ✅ Health check route
@app.get("/")
def root():
    return {"message": "SmartStore Copilot API is running"}