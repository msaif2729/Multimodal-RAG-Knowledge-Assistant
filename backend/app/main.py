from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import sources, chat, health
from app.core.config import settings
from app.core.database import init_chroma

app = FastAPI(
    title="Multi-Modal RAG Knowledge Assistant",
    description="AI-powered knowledge base with PDF, Website, and YouTube support",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_chroma()

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(sources.router, prefix="/api/sources", tags=["sources"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])