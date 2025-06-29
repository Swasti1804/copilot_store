import shutil

def upload_csv(src, dest):
    shutil.copy(src, dest)
    print(f"✅ Copied {src} to {dest}")

if __name__ == "__main__":
    upload_csv("samples/inventory_sample.csv", "../data/inventory/inventory.csv")
    upload_csv("samples/drivers_sample.csv", "../data/drivers/drivers.csv")
