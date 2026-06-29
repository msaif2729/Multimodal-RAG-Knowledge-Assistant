import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { streamChat } from '../services/api'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (question) => {
    const userMsg = { role: 'user', content: question, id: Date.now() }

    // Placeholder streaming message
    const assistantId = Date.now() + 1
    const assistantMsg = {
      role: 'assistant',
      content: '',
      citations: [],
      id: assistantId,
      streaming: true,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setLoading(true)

    const history = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      await streamChat(
        question,
        history,
        // onToken — append each word to message
        (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + token }
                : m
            )
          )
        },
        // onCitations
        (citations) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, citations } : m
            )
          )
        },
        // onDone
        () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m
            )
          )
          setLoading(false)
        },
        // onError
        (err) => {
          toast.error(err || 'Something went wrong')
          setMessages((prev) => prev.filter((m) => m.id !== assistantId))
          setLoading(false)
        }
      )
    } catch (err) {
      toast.error('Failed to connect to backend')
      setMessages((prev) => prev.filter((m) => m.id !== assistantId && m.id !== userMsg.id))
      setLoading(false)
    }
  }, [messages])

  const clearChat = () => setMessages([])

  return { messages, loading, sendMessage, clearChat }
}