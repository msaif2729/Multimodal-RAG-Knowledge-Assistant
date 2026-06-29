from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.models.schemas import URLIngest, SummarizeRequest, QuizRequest
from app.services import pdf_service, website_service, youtube_service, vector_store, gemini_service
from app.core.auth import get_current_user

router = APIRouter()


@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    try:
        content = await file.read()
        source_id, title, chunks = pdf_service.process_pdf(content, file.filename)
        chunk_count = vector_store.store_chunks(
            chunks=chunks,
            source_id=source_id,
            source_title=title,
            source_type="pdf",
            user_id=user["uid"],
        )
        return {"id": source_id, "title": title, "chunk_count": chunk_count, "source_type": "pdf"}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")


@router.post("/ingest-url")
async def ingest_url(
    payload: URLIngest,
    user=Depends(get_current_user),
):
    url = str(payload.url)
    try:
        source_id, title, chunks = website_service.process_website(url, payload.title)
        chunk_count = vector_store.store_chunks(
            chunks=chunks,
            source_id=source_id,
            source_title=title,
            source_type="website",
            user_id=user["uid"],
            extra_metadata={"url": url},
        )
        return {"id": source_id, "title": title, "chunk_count": chunk_count, "source_type": "website"}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape website: {str(e)}")


@router.post("/ingest-youtube")
async def ingest_youtube(
    payload: URLIngest,
    user=Depends(get_current_user),
):
    url = str(payload.url)
    try:
        source_id, title, chunks = youtube_service.process_youtube(url)
        chunk_count = vector_store.store_chunks(
            chunks=chunks,
            source_id=source_id,
            source_title=title,
            source_type="youtube",
            user_id=user["uid"],
            extra_metadata={"url": url},
        )
        return {"id": source_id, "title": title, "chunk_count": chunk_count, "source_type": "youtube"}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process YouTube video: {str(e)}")


@router.get("/")
async def list_sources(user=Depends(get_current_user)):
    sources = vector_store.get_all_sources(user["uid"])
    return {"sources": sources, "total": len(sources)}


@router.delete("/{source_id}")
async def delete_source(
    source_id: str,
    user=Depends(get_current_user),
):
    deleted = vector_store.delete_source(source_id, user["uid"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Source not found.")
    return {"message": "Source deleted successfully", "source_id": source_id}


@router.post("/summarize")
async def summarize_source(
    payload: SummarizeRequest,
    user=Depends(get_current_user),
):
    chunks = vector_store.get_source_chunks(payload.source_id, user["uid"])
    if not chunks:
        raise HTTPException(status_code=404, detail="Source not found.")
    sources = vector_store.get_all_sources(user["uid"])
    source_info = next((s for s in sources if s["id"] == payload.source_id), None)
    title = source_info["title"] if source_info else "Unknown"
    source_type = source_info["source_type"] if source_info else "document"
    summary = gemini_service.summarize_content(chunks, title, source_type)
    return {"source_id": payload.source_id, "title": title, "summary": summary}


@router.post("/quiz")
async def generate_quiz(
    payload: QuizRequest,
    user=Depends(get_current_user),
):
    chunks = vector_store.get_source_chunks(payload.source_id, user["uid"])
    if not chunks:
        raise HTTPException(status_code=404, detail="Source not found.")
    sources = vector_store.get_all_sources(user["uid"])
    source_info = next((s for s in sources if s["id"] == payload.source_id), None)
    title = source_info["title"] if source_info else "Unknown"
    quiz = gemini_service.generate_quiz(chunks, title, payload.num_questions)
    return {"source_id": payload.source_id, "title": title, "quiz": quiz}


@router.get("/stats")
async def get_stats(user=Depends(get_current_user)):
    """Get knowledge base statistics for the current user."""
    sources = vector_store.get_all_sources(user["uid"])
    
    total_chunks = sum(s["chunk_count"] for s in sources)
    
    by_type = {"pdf": 0, "website": 0, "youtube": 0}
    for source in sources:
        source_type = source.get("source_type", "pdf")
        if source_type in by_type:
            by_type[source_type] += 1

    return {
        "total_sources": len(sources),
        "total_chunks": total_chunks,
        "by_type": by_type,
        "sources": sources,
    }