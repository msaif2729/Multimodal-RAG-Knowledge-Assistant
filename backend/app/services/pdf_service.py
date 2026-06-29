import io
import uuid
from typing import Tuple, List
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract full text from PDF bytes."""
    reader = PdfReader(io.BytesIO(file_bytes))
    text_parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            text_parts.append(text.strip())
    return "\n\n".join(text_parts)


def chunk_text(text: str) -> List[str]:
    """Split text into overlapping chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_text(text)


def process_pdf(file_bytes: bytes, filename: str) -> Tuple[str, str, List[str]]:
    """
    Process a PDF file.
    Returns: (source_id, title, chunks)
    """
    source_id = str(uuid.uuid4())
    title = filename.replace(".pdf", "").replace("_", " ").title()
    text = extract_text_from_pdf(file_bytes)
    if not text.strip():
        raise ValueError("Could not extract text from PDF. The file may be scanned or image-based.")
    chunks = chunk_text(text)
    return source_id, title, chunks