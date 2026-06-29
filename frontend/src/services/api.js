import axios from 'axios'
import { auth } from '../firebase'


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
})

// Auto attach token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const uploadPDF = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/sources/upload-pdf', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  })
}

export const ingestURL = (url, title) =>
  api.post('/sources/ingest-url', { url, title })

export const ingestYouTube = (url) =>
  api.post('/sources/ingest-youtube', { url })

export const listSources = () => api.get('/sources/')

export const deleteSource = (id) => api.delete(`/sources/${id}`)

export const summarizeSource = (source_id) =>
  api.post('/sources/summarize', { source_id })

export const generateQuiz = (source_id, num_questions = 5) =>
  api.post('/sources/quiz', { source_id, num_questions })

export const sendChat = (question, history = []) =>
  api.post('/chat/', { question, history })

export const checkHealth = () => api.get('/health')

export const streamChat = async (question, history = [], onToken, onCitations, onDone, onError) => {
  const user = auth.currentUser
  const token = user ? await user.getIdToken() : null

  const response = await fetch(`${BASE_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ question, history }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          if (data.type === 'token') onToken(data.content)
          else if (data.type === 'citations') onCitations(data.content)
          else if (data.type === 'done') onDone()
          else if (data.type === 'error') onError(data.content)
        } catch {}
      }
    }
  }
}

export const getStats = () => api.get('/sources/stats')


export default api