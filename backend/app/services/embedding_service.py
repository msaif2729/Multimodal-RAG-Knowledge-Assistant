import google.generativeai as genai
from app.core.config import settings
from typing import List

genai.configure(api_key=settings.GEMINI_API_KEY)

def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a list of texts."""
    embeddings = []
    for text in texts:
        result = genai.embed_content(
            model="models/gemini-embedding-2",
            content=text,
            task_type="retrieval_document",
        )
        embeddings.append(result["embedding"])
    return embeddings

def get_query_embedding(query: str) -> List[float]:
    """Generate embedding for a search query."""
    result = genai.embed_content(
        model="models/gemini-embedding-2",
        content=query,
        task_type="retrieval_query",
    )
    return result["embedding"]