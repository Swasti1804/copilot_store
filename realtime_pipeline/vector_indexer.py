def update_vector_store(data_type, content):
    print(f"🧠 Updating vector store for {data_type}...")
    print(f"🔎 Indexed content: {content[:100]}...")

# Example usage
if __name__ == "__main__":
    update_vector_store("inventory", "Store 002 has shortage of Coke.")
