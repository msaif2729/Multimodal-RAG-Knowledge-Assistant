import { Trash2, BookOpen, HelpCircle, FileText, Globe, PlayCircle } from 'lucide-react'

const TYPE_CONFIG = {
  pdf: { icon: FileText, color: '#f87171', bg: '#2d1515', label: 'PDF' },
  website: { icon: Globe, color: '#60a5fa', bg: '#0f1f35', label: 'Website' },
  youtube: { icon: PlayCircle, color: '#f472b6', bg: '#2d1528', label: 'YouTube' },
}

export default function SourceCard({ source, onDelete, onSummarize, onQuiz }) {
  const config = TYPE_CONFIG[source.source_type] || TYPE_CONFIG.pdf
  const Icon = config.icon

  return (
    <div
      style={{
        marginBottom: '6px', padding: '10px 12px', borderRadius: '10px',
        backgroundColor: '#13131f', border: '1px solid #1e1e2e',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2d2d44'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          backgroundColor: config.bg, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} color={config.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '13px', fontWeight: '500', color: '#e2e8f0',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginBottom: '4px',
          }}>
            {source.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '10px', fontWeight: '600', color: config.color,
              backgroundColor: config.bg, padding: '2px 6px',
              borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {config.label}
            </span>
            <span style={{ fontSize: '11px', color: '#475569' }}>
              {source.chunk_count} chunks
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(source.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#334155', padding: '2px', borderRadius: '4px',
            flexShrink: 0, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={e => e.currentTarget.style.color = '#334155'}
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
        {[
          { label: 'Summarize', icon: BookOpen, action: () => onSummarize(source) },
          { label: 'Quiz', icon: HelpCircle, action: () => onQuiz(source) },
        ].map(({ label, icon: BtnIcon, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '5px', fontSize: '11px', color: '#64748b',
              backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
              padding: '5px', borderRadius: '6px', cursor: 'pointer',
              transition: 'all 0.15s', fontWeight: '500',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#818cf8'
              e.currentTarget.style.borderColor = '#3730a3'
              e.currentTarget.style.backgroundColor = '#1e1b4b'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#64748b'
              e.currentTarget.style.borderColor = '#1e1e2e'
              e.currentTarget.style.backgroundColor = '#0f0f17'
            }}
          >
            <BtnIcon size={11} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}