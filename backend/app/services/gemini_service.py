from typing import List, Dict, Any, Generator
import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("models/gemini-2.5-flash")


def generate_rag_answer(question: str, context_chunks: List[Dict[str, Any]], history: List[Dict] = None) -> str:
    """Generate a full answer (non-streaming)."""
    context_text = "\n\n---\n\n".join([
        f"[Source: {c['metadata'].get('source_title', 'Unknown')} ({c['metadata'].get('source_type', 'unknown')})]:\n{c['text']}"
        for c in context_chunks
    ])

    history_text = ""
    if history:
        for msg in history[-6:]:
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"

    prompt = f"""You are a knowledgeable AI assistant. Answer the user's question based ONLY on the provided context.
If the context doesn't contain enough information, say so clearly. Be concise, accurate, and helpful.
Always reference which source you are drawing from when relevant.

CONTEXT:
{context_text}

{'CONVERSATION HISTORY:' + history_text if history_text else ''}

USER QUESTION: {question}

ANSWER:"""

    response = model.generate_content(prompt)
    return response.text


def stream_rag_answer(question: str, context_chunks: List[Dict[str, Any]], history: List[Dict] = None) -> Generator:
    """Stream answer word by word."""
    context_text = "\n\n---\n\n".join([
        f"[Source: {c['metadata'].get('source_title', 'Unknown')} ({c['metadata'].get('source_type', 'unknown')})]:\n{c['text']}"
        for c in context_chunks
    ])

    history_text = ""
    if history:
        for msg in history[-6:]:
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"

    prompt = f"""You are a knowledgeable AI assistant. Answer the user's question based ONLY on the provided context.
If the context doesn't contain enough information, say so clearly. Be concise, accurate, and helpful.
Always reference which source you are drawing from when relevant.

CONTEXT:
{context_text}

{'CONVERSATION HISTORY:' + history_text if history_text else ''}

USER QUESTION: {question}

ANSWER:"""

    response = model.generate_content(prompt, stream=True)
    for chunk in response:
        if chunk.text:
            yield chunk.text


def summarize_content(chunks: List[str], title: str, source_type: str) -> str:
    sample_text = "\n\n".join(chunks[:10])
    prompt = f"""You are summarizing content from a {source_type} titled "{title}".

Content:
{sample_text}

Please provide:
1. **Overview**: A 2-3 sentence summary of the main topic
2. **Key Points**: 5-7 bullet points of the most important information
3. **Main Themes**: 2-3 overarching themes or concepts

Keep the summary concise and informative."""

    response = model.generate_content(prompt)
    return response.text


def generate_quiz(chunks: List[str], title: str, num_questions: int = 5) -> str:
    sample_text = "\n\n".join(chunks[:8])
    prompt = f"""Based on the following content from "{title}", generate {num_questions} multiple-choice quiz questions.

Content:
{sample_text}

Format each question as:
**Q[number]. [Question text]**
A) [Option]
B) [Option]  
C) [Option]
D) [Option]
**Answer: [Letter]**
**Explanation: [Brief explanation]**

Generate exactly {num_questions} questions covering different aspects of the content."""

    response = model.generate_content(prompt)
    return response.text