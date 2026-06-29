import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }

  return (
    <div style={{
      padding: '16px 24px 20px',
      borderTop: '1px solid #1e1e2e',
      backgroundColor: '#0a0a0f',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '10px',
        backgroundColor: '#13131f',
        border: `1px solid ${value ? '#3730a3' : '#1e1e2e'}`,
        borderRadius: '14px', padding: '12px 14px',
        transition: 'border-color 0.15s',
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask anything about your sources... (Enter to send)"
          rows={1}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#e2e8f0', fontSize: '14px', resize: 'none',
            lineHeight: '1.6', maxHeight: '160px',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          style={{
            width: '36px', height: '36px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: disabled || !value.trim()
              ? '#1e1e2e'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '10px', cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s', opacity: disabled ? 0.5 : 1,
          }}
        >
          <Send size={15} color={disabled || !value.trim() ? '#475569' : 'white'} />
        </button>
      </div>
      <p style={{ fontSize: '11px', color: '#334155', textAlign: 'center', marginTop: '8px' }}>
        Shift+Enter for new line • Enter to send
      </p>
    </div>
  )
}