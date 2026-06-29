import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Loader2, HelpCircle, Sparkles, RotateCcw } from 'lucide-react'
import Modal from '../ui/Modal'
import * as api from '../../services/api'
import toast from 'react-hot-toast'

export default function QuizModal({ source, onClose }) {
  const [quiz, setQuiz] = useState('')
  const [loading, setLoading] = useState(false)
  const [numQuestions, setNumQuestions] = useState(5)
  const [generated, setGenerated] = useState(false)

  const handleClose = () => {
    setQuiz('')
    setGenerated(false)
    setLoading(false)
    onClose()
  }

  const handleGenerate = async () => {
    setLoading(true)
    setQuiz('')
    try {
      const res = await api.generateQuiz(source.id, numQuestions)
      setQuiz(res.data.quiz)
      setGenerated(true)
    } catch {
      toast.error('Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={!!source}
      onClose={handleClose}
      title={`Quiz — ${source?.title || ''}`}
      maxWidth="620px"
    >
      {!generated && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '16px 0' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
            border: '1px solid #3730a3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HelpCircle size={24} color="#818cf8" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 8px' }}>
              Generate a Quiz
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
              Test your knowledge with AI-generated multiple choice questions.
            </p>
          </div>

          <div style={{ width: '100%' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Number of Questions
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[3, 5, 7, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  style={{
                    width: '56px', height: '48px', borderRadius: '10px',
                    fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer',
                    transition: 'all 0.15s',
                    backgroundColor: numQuestions === n ? '#4338ca' : '#13131f',
                    color: numQuestions === n ? 'white' : '#64748b',
                    boxShadow: numQuestions === n ? '0 0 0 1px #6366f1' : '0 0 0 1px #1e1e2e',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '11px 28px', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Sparkles size={15} />
            Generate {numQuestions} Questions
          </button>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '32px 0' }}>
          <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 4px' }}>
              Generating {numQuestions} questions...
            </p>
            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>This may take a few seconds</p>
          </div>
        </div>
      )}

      {generated && !loading && (
        <div>
          <div style={{
            backgroundColor: '#13131f', border: '1px solid #1e1e2e',
            borderRadius: '12px', padding: '16px 18px',
            maxHeight: '55vh', overflowY: 'auto',
          }}>
            <div className="ai-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{quiz}</ReactMarkdown>
            </div>
          </div>
          <button
            onClick={() => { setGenerated(false); setQuiz('') }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginTop: '14px', fontSize: '13px', color: '#6366f1',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <RotateCcw size={13} />
            Generate Again
          </button>
        </div>
      )}
    </Modal>
  )
}