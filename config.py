import os
from dotenv import load_dotenv

# Load the .env file immediately
load_dotenv()

class Config:
    # We define the model here. 
    MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct"
    
    # API Keys
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

