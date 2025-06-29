import csv
import os
from app.config import settings

def get_driver_risks():
    file_path = os.path.join(settings.DATA_DIR, "drivers.csv")
    risks = []

    try:
        with open(file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                risks.append(row)
        return {"status": "success", "drivers": risks}
    except FileNotFoundError:
        return {"status": "error", "message": "Driver risk file not found"}
