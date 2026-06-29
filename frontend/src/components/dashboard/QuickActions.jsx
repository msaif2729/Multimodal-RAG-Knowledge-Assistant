import { Plus, MessageSquare, Trash2, RefreshCw } from 'lucide-react'

export default function QuickActions({ onAddSource, onGoToChat, onRefresh }) {
  const actions = [
    {
      icon: MessageSquare,
      label: 'Go to Chat',
      description: 'Ask questions about your sources',
      color: '#818cf8',
      bg: '#1e1b4b',
      border: '#3730a3',
      onClick: onGoToChat,
    },
    {
      icon: Plus,
      label: 'Add Source',
      description: 'Upload PDF, website or YouTube',
      color: '#34d399',
      bg: '#064e3b',
      border: '#065f46',
      onClick: onAddSource,
    },
    {
      icon: RefreshCw,
      label: 'Refresh Stats',
      description: 'Update dashboard data',
      color: '#60a5fa',
      bg: '#1e3a5f',
      border: '#1d4ed8',
      onClick: onRefresh,
    },
  ]

  return (
    <div style={{
      backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
      borderRadius: '14px', padding: '24px',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 16px' }}>
        Quick Actions
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {actions.map(({ icon: Icon, label, description, color, bg, border, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '10px',
              backgroundColor: '#13131f', border: '1px solid #1e1e2e',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              width: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = bg
              e.currentTarget.style.borderColor = border
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#13131f'
              e.currentTarget.style.borderColor = '#1e1e2e'
            }}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              backgroundColor: bg, border: `1px solid ${border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={15} color={color} />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#e2e8f0', margin: '0 0 2px' }}>
                {label}
              </p>
              <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>
                {description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}