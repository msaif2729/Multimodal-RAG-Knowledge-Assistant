import { FileText, Globe, PlayCircle } from 'lucide-react'

const TYPE_CONFIG = {
  pdf: { icon: FileText, color: '#f87171', bg: '#2d1515', label: 'PDF' },
  website: { icon: Globe, color: '#60a5fa', bg: '#0f1f35', label: 'Website' },
  youtube: { icon: PlayCircle, color: '#f472b6', bg: '#2d1528', label: 'YouTube' },
}

export default function CitationCard({ citation }) {
  const config = TYPE_CONFIG[citation.source_type] || TYPE_CONFIG.pdf
  const Icon = config.icon
  const pct = Math.round(citation.relevance_score * 100)

  return (
    <div style={{
      padding: '10px 12px', borderRadius: '10px',
      backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <div style={{
          width: '22px', height: '22px', borderRadius: '6px',
          backgroundColor: config.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={12} color={config.color} />
        </div>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#cbd5e1', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {citation.source_title}
        </span>
        <span style={{
          fontSize: '10px', fontWeight: '600', color: config.color,
          backgroundColor: config.bg, padding: '2px 6px', borderRadius: '4px',
        }}>
          {pct}% match
        </span>
      </div>
      <p style={{
        fontSize: '11px', color: '#475569', lineHeight: '1.6',
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {citation.chunk_text}
      </p>
    </div>
  )
}