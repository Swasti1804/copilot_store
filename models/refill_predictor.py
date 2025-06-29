def predict_low_stock(inventory):
    low_items = []
    for item in inventory:
        stock = int(item.get("stock", 0))
        if stock < 10:
            low_items.append(item)
    return low_items
