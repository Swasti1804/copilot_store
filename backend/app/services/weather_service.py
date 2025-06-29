import os
import requests
from dotenv import load_dotenv

# ✅ Correct path: backend/.env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
print("Looking for .env at:", env_path)

load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("WEATHER_API_KEY")
print("Loaded WEATHER_API_KEY:", API_KEY)  # ✅ Must show your actual key


def fetch_weather(city: str):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            return {
                "city": city,
                "status": data["weather"][0]["main"],
                "description": data["weather"][0]["description"],
                "temperature": data["main"]["temp"],
                "alert": data["weather"][0]["main"] in ["Rain", "Thunderstorm", "Snow"]
            }
        else:
            return {"error": data.get("message", "Failed to get weather")}
    except Exception as e:
        return {"error": str(e)}
