# Multi-Modal RAG Knowledge Assistant

An AI-powered knowledge base that lets you chat with your PDFs, websites, and YouTube videos using RAG (Retrieval Augmented Generation).

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green) ![Gemini](https://img.shields.io/badge/Gemini-2.5Flash-orange)

## Features

- Upload PDFs and extract knowledge
- Scrape websites for content
- Extract YouTube video transcripts
- Semantic search with ChromaDB vector database
- Real-time streaming responses (like ChatGPT)
- Source citations for every answer
- AI-powered summarization
- Quiz generation from sources
- Firebase Authentication (Google + Email)
- Per-user knowledge base isolation
- Analytics dashboard

## Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- Firebase Authentication

### Backend
- FastAPI (Python)
- ChromaDB (Vector Database)
- Google Gemini API (LLM + Embeddings)
- LangChain (Text Splitting)
- PyPDF, BeautifulSoup, YouTube Transcript API

## Setup

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
# Create .env with Firebase config and VITE_API_URL
npm run dev
```

## Environment Variables

### Backend `.env`
```bash
GEMINI_API_KEY=your_key_here
CHROMA_PERSIST_DIRECTORY=./chroma_db
COLLECTION_NAME=knowledge_base
```

### Frontend `.env`
```bash
VITE_API_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```
## License
MIT