import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import ChatRequest, ChatResponse, Citation
from app.services import vector_store, gemini_service
from app.core.auth import get_current_user

router = APIRouter()


@router.post("/stream")
async def chat_stream(
    payload: ChatRequest,
    user=Depends(get_current_user),
):
    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    hits = vector_store.semantic_search(payload.question, user["uid"])

    if not hits:
        async def no_sources():
            data = json.dumps({"type": "error", "content": "No sources found. Please add some sources first."})
            yield f"data: {data}\n\n"
        return StreamingResponse(no_sources(), media_type="text/event-stream")

    seen = set()
    citations = []
    for hit in hits:
        sid = hit["metadata"].get("source_id")
        if sid not in seen:
            seen.add(sid)
            citations.append({
                "source_id": sid,
                "source_title": hit["metadata"].get("source_title", "Unknown"),
                "source_type": hit["metadata"].get("source_type", "unknown"),
                "chunk_text": hit["text"][:300] + "..." if len(hit["text"]) > 300 else hit["text"],
                "relevance_score": round(hit["relevance_score"], 3),
            })

    history = [{"role": m.role, "content": m.content} for m in (payload.history or [])]

    async def generate():
        try:
            yield f"data: {json.dumps({'type': 'citations', 'content': citations})}\n\n"
            for chunk in gemini_service.stream_rag_answer(payload.question, hits, history):
                yield f"data: {json.dumps({'type': 'token', 'content': chunk})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    user=Depends(get_current_user),
):
    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    hits = vector_store.semantic_search(payload.question, user["uid"])
    if not hits:
        return ChatResponse(
            answer="No sources found. Please add some sources first.",
            citations=[],
            question=payload.question,
        )

    history = [{"role": m.role, "content": m.content} for m in (payload.history or [])]
    answer = gemini_service.generate_rag_answer(payload.question, hits, history)

    seen = set()
    citations = []
    for hit in hits:
        sid = hit["metadata"].get("source_id")
        if sid not in seen:
            seen.add(sid)
            citations.append(Citation(
                source_id=sid,
                source_title=hit["metadata"].get("source_title", "Unknown"),
                source_type=hit["metadata"].get("source_type", "unknown"),
                chunk_text=hit["text"][:300] + "..." if len(hit["text"]) > 300 else hit["text"],
                relevance_score=round(hit["relevance_score"], 3),
            ))

    return ChatResponse(answer=answer, citations=citations, question=payload.question)