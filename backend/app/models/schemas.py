from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from enum import Enum

class SourceType(str, Enum):
    pdf = "pdf"
    website = "website"
    youtube = "youtube"

class SourceBase(BaseModel):
    source_type: SourceType
    title: str

class SourceResponse(SourceBase):
    id: str
    chunk_count: int
    created_at: str
    metadata: Optional[dict] = {}

class URLIngest(BaseModel):
    url: str
    title: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    sources: Optional[List[dict]] = None

class ChatRequest(BaseModel):
    question: str
    history: Optional[List[ChatMessage]] = []

class Citation(BaseModel):
    source_id: str
    source_title: str
    source_type: str
    chunk_text: str
    relevance_score: float

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    question: str

class SummarizeRequest(BaseModel):
    source_id: str

class QuizRequest(BaseModel):
    source_id: str
    num_questions: int = 5