import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = '520px' }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'relative', width: '100%', maxWidth,
        backgroundColor: '#0f0f17',
        border: '1px solid #1e1e2e',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid #1e1e2e',
          background: 'linear-gradient(180deg, #13131f 0%, #0f0f17 100%)',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: '1px solid #1e1e2e',
              cursor: 'pointer', color: '#475569', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f1f5f9'
              e.currentTarget.style.borderColor = '#334155'
              e.currentTarget.style.backgroundColor = '#1e1e2e'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#475569'
              e.currentTarget.style.borderColor = '#1e1e2e'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}