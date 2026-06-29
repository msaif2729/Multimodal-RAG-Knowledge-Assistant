import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings

_client = None
_collection = None

def init_chroma():
    global _client, _collection
    _client = chromadb.PersistentClient(
        path=settings.CHROMA_PERSIST_DIRECTORY,
        settings=ChromaSettings(anonymized_telemetry=False),
    )
    _collection = _client.get_or_create_collection(
        name=settings.COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
    return _collection

def get_collection():
    global _collection
    if _collection is None:
        init_chroma()
    return _collection

def get_client():
    global _client
    if _client is None:
        init_chroma()
    return _client