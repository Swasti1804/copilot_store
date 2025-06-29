import random

# Simulate Twitter sentiment response
def analyze_sentiment():
    sentiments = ["positive", "neutral", "negative"]
    sample = random.choice(sentiments)
    return {"status": "success", "sentiment": sample}
