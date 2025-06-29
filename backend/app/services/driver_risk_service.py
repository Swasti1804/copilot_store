import csv
import os
from app.config import settings

def get_driver_risks():
    file_path = os.path.join(settings.DATA_DIR, "drivers.csv")
    drivers = []

    try:
        with open(file_path, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                drivers.append({
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                    "phone": row["phone"],
                    "status": row["status"],
                    "location": row["location"],
                    "vehicle": row["vehicle"],
                    "safetyScore": int(row["safetyScore"]),
                    "deliveries": int(row["deliveries"]),
                    "incidents": int(row["incidents"]),
                    "lastActive": row["lastActive"],
                    "joinDate": row["joinDate"],
                    "certifications": row["certifications"].split(";") if row["certifications"] else [],
                    "riskLevel": row["riskLevel"],
                    "avatar": row.get("avatar", ""),
                })
        return {"status": "success", "drivers": drivers}
    except FileNotFoundError:
        return {"status": "error", "message": "Driver risk file not found"}
