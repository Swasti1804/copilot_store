import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env
load_dotenv()

class Settings:
    def __init__(self):
        # ✅ Base directory of the project (2 levels up from this file)
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

        # ✅ Use .env DATA_DIR or fallback to ./data/inventory inside project
        env_data_dir = os.getenv("DATA_DIR")
        self.DATA_DIR = (
            env_data_dir
            if os.path.isabs(env_data_dir)
            else os.path.abspath(os.path.join(base_dir, env_data_dir or "data/inventory"))
        )

        print(f"📂 Using data directory: {self.DATA_DIR}")  # ✅ Debugging path

    def inventory_file_path(self):
        return os.path.join(self.DATA_DIR, "inventory.csv")

    def reorders_file_path(self):
        return os.path.join(self.DATA_DIR, "reorders.csv")

    def transfers_file_path(self):
        return os.path.join(self.DATA_DIR, "transfers.csv")

settings = Settings()
