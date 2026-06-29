import uuid
import re
from typing import Tuple, List
from youtube_transcript_api import YouTubeTranscriptApi
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",
        r"(?:embed\/)([0-9A-Za-z_-]{11})",
        r"(?:youtu\.be\/)([0-9A-Za-z_-]{11})",
        r"(?:shorts\/)([0-9A-Za-z_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError(f"Could not extract video ID from URL: {url}")


def get_youtube_transcript(video_id: str) -> Tuple[str, str]:
    """Fetch transcript for a YouTube video using new API."""
    ytt_api = YouTubeTranscriptApi()
    fetched = ytt_api.fetch(video_id)

    texts = []
    for entry in fetched:
        if hasattr(entry, 'text'):
            texts.append(entry.text)
        elif isinstance(entry, dict):
            texts.append(entry.get('text', ''))

    if not texts:
        raise ValueError("No transcript content found for this video.")

    full_text = " ".join(texts)
    title = f"YouTube Video ({video_id})"
    return title, full_text


def chunk_text(text: str) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=[". ", "\n", " ", ""],
    )
    return splitter.split_text(text)


def process_youtube(url: str) -> Tuple[str, str, List[str]]:
    """
    Process a YouTube URL.
    Returns: (source_id, title, chunks)
    """
    source_id = str(uuid.uuid4())
    video_id = extract_video_id(url)
    title, text = get_youtube_transcript(video_id)
    if not text.strip():
        raise ValueError("Could not extract transcript from the YouTube video.")
    chunks = chunk_text(text)
    return source_id, title, chunks