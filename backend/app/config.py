import os
from dotenv import load_dotenv

load_dotenv()  # Loads .env from backend/

class Settings:
    DATA_DIR = os.getenv("DATA_DIR", "../data/inventory")  # Updated to match actual CSV location

    def inventory_file_path(self):
        return os.path.join(self.DATA_DIR, "inventory.csv")

settings = Settings()
