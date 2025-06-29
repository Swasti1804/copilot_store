import os
import requests
from dotenv import load_dotenv

# Load .env file from project root
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("WEATHER_API_KEY")

def fetch_weather(city: str):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            # Extract all needed values safely
            weather = data.get("weather", [{}])[0]
            main = data.get("main", {})
            wind = data.get("wind", {})

            return {
                "city": city,
                "status": weather.get("main", "Unknown"),
                "description": weather.get("description", ""),
                "temperature": main.get("temp", 0),
                "humidity": main.get("humidity", 0),
                "wind_speed": wind.get("speed", 0),
                "uv_index": 6,  # You can later fetch this via One Call API
                "alert": weather.get("main") in ["Rain", "Thunderstorm", "Snow"]
            }
        else:
            return {"error": data.get("message", "Failed to get weather")}
    except Exception as e:
        return {"error": str(e)}
