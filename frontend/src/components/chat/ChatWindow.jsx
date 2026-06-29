import { useEffect, useRef } from 'react'
import { Bot, Trash2, Sparkles, LogOut } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import Spinner from '../ui/Spinner'
import { useAuth } from '../../context/AuthContext'

const SUGGESTIONS = [
  'Summarize the main topics covered across all sources',
  'What are the key concepts explained?',
  'Compare the information across different sources',
]

export default function ChatWindow({ messages, loading, onSend, onClear }) {
  const bottomRef = useRef(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0a0a0f' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', borderBottom: '1px solid #1e1e2e',
        backgroundColor: '#0a0a0f',
      }}>
        {/* Left — Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
            border: '1px solid #3730a3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={18} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>
              Knowledge Assistant
            </div>
            <div style={{ fontSize: '11px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={10} />
              Powered by Gemini 2.5 Flash
            </div>
          </div>
        </div>

        {/* Right — User info + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              onClick={onClear}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: '#475569',
                background: 'none', border: '1px solid #1e1e2e',
                padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f87171'
                e.currentTarget.style.borderColor = '#7f1d1d'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#475569'
                e.currentTarget.style.borderColor = '#1e1e2e'
              }}
            >
              <Trash2 size={13} />
              Clear
            </button>
          )}

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', backgroundColor: '#1e1e2e' }} />

          {/* Avatar */}
          {user?.photo ? (
            <img
              src={user.photo}
              alt="avatar"
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                border: '2px solid #1e1e2e', objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4338ca, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: 'white', fontWeight: '700',
              border: '2px solid #3730a3',
            }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          {/* User email */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#e2e8f0' }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '10px', color: '#475569' }}>
              {user?.email}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', color: '#475569',
              background: 'none', border: '1px solid #1e1e2e',
              padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f87171'
              e.currentTarget.style.borderColor = '#7f1d1d'
              e.currentTarget.style.backgroundColor = '#2d151520'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#475569'
              e.currentTarget.style.borderColor = '#1e1e2e'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
              border: '1px solid #3730a3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={28} color="#818cf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>
                Ask your knowledge base
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', maxWidth: '400px', lineHeight: '1.6' }}>
                Add PDFs, websites, or YouTube videos from the sidebar, then ask questions to get AI-powered answers with source citations.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '480px' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  style={{
                    textAlign: 'left', fontSize: '13px', color: '#64748b',
                    backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    transition: 'all 0.15s', lineHeight: '1.5',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#a5b4fc'
                    e.currentTarget.style.borderColor = '#3730a3'
                    e.currentTarget.style.backgroundColor = '#13131f'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#64748b'
                    e.currentTarget.style.borderColor = '#1e1e2e'
                    e.currentTarget.style.backgroundColor = '#0f0f17'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {loading && !messages.some(m => m.streaming) && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
                  border: '1px solid #3730a3',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={15} color="#818cf8" />
                </div>
                <div style={{
                  backgroundColor: '#13131f', border: '1px solid #1e1e2e',
                  borderRadius: '16px', borderTopLeftRadius: '4px',
                  padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <Spinner size="sm" />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  )
}