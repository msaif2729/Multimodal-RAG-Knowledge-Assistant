import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot, User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import CitationCard from './CitationCard'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const [showCitations, setShowCitations] = useState(false)
  const hasCitations = message.citations && message.citations.length > 0

  return (
    <div style={{ display: 'flex', gap: '12px', flexDirection: isUser ? 'row-reverse' : 'row' }}>
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
        background: isUser
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          : 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
        border: isUser ? 'none' : '1px solid #3730a3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isUser
          ? <User size={15} color="white" />
          : <Bot size={15} color="#818cf8" />
        }
      </div>

      {/* Content */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '6px',
        maxWidth: '75%', alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: '16px',
          borderTopRightRadius: isUser ? '4px' : '16px',
          borderTopLeftRadius: isUser ? '16px' : '4px',
          backgroundColor: isUser ? '#4338ca' : '#13131f',
          border: isUser ? 'none' : '1px solid #1e1e2e',
          fontSize: '14px', lineHeight: '1.7',
          color: isUser ? '#e0e7ff' : '#cbd5e1',
          minWidth: '40px',
        }}>
          {isUser ? (
            <p style={{ margin: 0 }}>{message.content}</p>
          ) : (
            <div className="ai-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content || ' '}
              </ReactMarkdown>
              {/* Blinking cursor while streaming */}
              {message.streaming && (
                <span style={{
                  display: 'inline-block',
                  width: '2px', height: '16px',
                  backgroundColor: '#6366f1',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'blink 1s step-end infinite',
                }} />
              )}
            </div>
          )}
        </div>

        {/* Citations */}
        {hasCitations && !message.streaming && (
          <div style={{ width: '100%' }}>
            <button
              onClick={() => setShowCitations(!showCitations)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', color: '#475569',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '2px 0', transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              {showCitations ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {message.citations.length} source{message.citations.length > 1 ? 's' : ''} cited
            </button>
            {showCitations && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {message.citations.map((citation, i) => (
                  <CitationCard key={i} citation={citation} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}