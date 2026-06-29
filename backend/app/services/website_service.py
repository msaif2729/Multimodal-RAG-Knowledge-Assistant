import uuid
import requests
from typing import Tuple, List
from bs4 import BeautifulSoup
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def scrape_website(url: str) -> Tuple[str, str]:
    """Scrape a website and return (title, clean_text)."""
    response = requests.get(url, headers=HEADERS, timeout=15)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove unwanted tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "iframe", "noscript"]):
        tag.decompose()

    # Get title
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else url

    # Extract main content
    main = soup.find("main") or soup.find("article") or soup.find("body")
    if main:
        text = main.get_text(separator="\n", strip=True)
    else:
        text = soup.get_text(separator="\n", strip=True)

    # Clean up whitespace
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    clean_text = "\n".join(lines)

    return title[:200], clean_text


def chunk_text(text: str) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_text(text)


def process_website(url: str, custom_title: str = None) -> Tuple[str, str, List[str]]:
    """
    Process a website URL.
    Returns: (source_id, title, chunks)
    """
    source_id = str(uuid.uuid4())
    title, text = scrape_website(url)
    if custom_title:
        title = custom_title
    if not text.strip():
        raise ValueError("Could not extract text from the website.")
    chunks = chunk_text(text)
    return source_id, title, chunks