import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Loader2, BookOpen, Sparkles, RotateCcw } from 'lucide-react'
import Modal from '../ui/Modal'
import * as api from '../../services/api'
import toast from 'react-hot-toast'

export default function SummarizeModal({ source, onClose }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleClose = () => {
    setSummary('')
    setGenerated(false)
    setLoading(false)
    onClose()
  }

  const handleGenerate = async () => {
    setLoading(true)
    setSummary('')
    try {
      const res = await api.summarizeSource(source.id)
      setSummary(res.data.summary)
      setGenerated(true)
    } catch {
      toast.error('Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={!!source}
      onClose={handleClose}
      title={`Summary — ${source?.title || ''}`}
      maxWidth="620px"
    >
      {!generated && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px 0' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
            border: '1px solid #3730a3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={24} color="#818cf8" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 8px' }}>
              AI Summary
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6', maxWidth: '340px' }}>
              Generate a concise summary with key points, main themes, and important concepts from this source.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', border: 'none', borderRadius: '10px',
              padding: '11px 24px', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Sparkles size={15} />
            Generate Summary
          </button>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '32px 0' }}>
          <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 4px' }}>Generating summary...</p>
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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            </div>
          </div>
          <button
            onClick={() => { setGenerated(false); setSummary('') }}
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