import time
import os

def watch_driver_file(file_path):
    print(f"👀 Watching driver file: {file_path}")
    last_modified = None

    while True:
        if os.path.exists(file_path):
            modified_time = os.path.getmtime(file_path)
            if modified_time != last_modified:
                last_modified = modified_time
                with open(file_path, "r") as file:
                    print("🚨 Driver safety file updated:")
                    print(file.read())
        time.sleep(3)

if __name__ == "__main__":
    watch_driver_file("../data/drivers/drivers.csv")
