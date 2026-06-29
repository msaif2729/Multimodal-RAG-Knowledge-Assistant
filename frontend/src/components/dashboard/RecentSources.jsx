import { FileText, Globe, PlayCircle, Clock } from 'lucide-react'

const TYPE_CONFIG = {
  pdf: { icon: FileText, color: '#f87171', bg: '#2d1515', label: 'PDF' },
  website: { icon: Globe, color: '#60a5fa', bg: '#0f1f35', label: 'Website' },
  youtube: { icon: PlayCircle, color: '#f472b6', bg: '#2d1528', label: 'YouTube' },
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Unknown'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function RecentSources({ sources }) {
  const recent = [...sources]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <div style={{
      backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
      borderRadius: '14px', padding: '24px',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 16px' }}>
        Recent Sources
      </h3>

      {recent.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
          <p style={{ color: '#475569', fontSize: '13px' }}>No sources added yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recent.map((source) => {
            const config = TYPE_CONFIG[source.source_type] || TYPE_CONFIG.pdf
            const Icon = config.icon
            return (
              <div key={source.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '10px',
                backgroundColor: '#13131f', border: '1px solid #1e1e2e',
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '8px',
                  backgroundColor: config.bg, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={config.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13px', fontWeight: '500', color: '#e2e8f0',
                    margin: '0 0 2px', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {source.title}
                  </p>
                  <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>
                    {source.chunk_count} chunks
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <Clock size={11} color="#475569" />
                  <span style={{ fontSize: '11px', color: '#475569' }}>
                    {timeAgo(source.created_at)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}