from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_db"
    COLLECTION_NAME: str = "knowledge_base"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RESULTS: int = 5
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "https://*.vercel.app"]

    class Config:
        env_file = ".env"

settings = Settings()