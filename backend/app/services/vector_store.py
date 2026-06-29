import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.database import get_collection
from app.services.embedding_service import get_embeddings, get_query_embedding
from app.core.config import settings


def store_chunks(
    chunks: List[str],
    source_id: str,
    source_title: str,
    source_type: str,
    user_id: str,
    extra_metadata: Optional[Dict] = None,
) -> int:
    """Store text chunks in ChromaDB with embeddings."""
    collection = get_collection()
    embeddings = get_embeddings(chunks)

    ids = [f"{source_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = []
    for i, chunk in enumerate(chunks):
        meta = {
            "source_id": source_id,
            "source_title": source_title,
            "source_type": source_type,
            "chunk_index": i,
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
        }
        if extra_metadata:
            meta.update(extra_metadata)
        metadatas.append(meta)

    collection.upsert(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadatas,
    )
    return len(chunks)


def semantic_search(query: str, user_id: str, top_k: int = None) -> List[Dict[str, Any]]:
    """Search for relevant chunks for a specific user."""
    collection = get_collection()
    k = top_k or settings.TOP_K_RESULTS
    query_embedding = get_query_embedding(query)

    count = collection.count()
    if count == 0:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(k, count),
        where={"user_id": user_id},
        include=["documents", "metadatas", "distances"],
    )

    hits = []
    if results and results["ids"][0]:
        for i, doc_id in enumerate(results["ids"][0]):
            hits.append({
                "id": doc_id,
                "text": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i],
                "relevance_score": 1 - results["distances"][0][i],
            })
    return hits


def get_all_sources(user_id: str) -> List[Dict[str, Any]]:
    """Get unique sources for a specific user."""
    collection = get_collection()
    if collection.count() == 0:
        return []

    all_items = collection.get(
        where={"user_id": user_id},
        include=["metadatas"],
    )

    sources = {}
    for meta in all_items["metadatas"]:
        sid = meta.get("source_id")
        if sid and sid not in sources:
            sources[sid] = {
                "id": sid,
                "title": meta.get("source_title", "Unknown"),
                "source_type": meta.get("source_type", "unknown"),
                "created_at": meta.get("created_at", ""),
                "chunk_count": 0,
                "metadata": {},
            }
        if sid:
            sources[sid]["chunk_count"] += 1
    return list(sources.values())


def delete_source(source_id: str, user_id: str) -> bool:
    """Delete all chunks belonging to a source for a specific user."""
    collection = get_collection()
    results = collection.get(
        where={"source_id": source_id, "user_id": user_id}
    )
    if results["ids"]:
        collection.delete(ids=results["ids"])
        return True
    return False


def get_source_chunks(source_id: str, user_id: str) -> List[str]:
    """Get all chunks for a specific source belonging to a user."""
    collection = get_collection()
    results = collection.get(
        where={"source_id": source_id, "user_id": user_id},
        include=["documents"],
    )
    return results["documents"] if results["documents"] else []