import random
import time

def stream_sentiment():
    reviews = [
        "Worst experience ever.",
        "Loved the burger combo!",
        "Delivery was super late!",
        "Clean store and fast service."
    ]

    while True:
        sample = random.choice(reviews)
        print(f"🗞️ New sentiment: {sample}")
        time.sleep(4)

if __name__ == "__main__":
    stream_sentiment()
