import { FileText, Globe, PlayCircle, TrendingUp, Layers } from 'lucide-react'

const TYPE_CONFIG = {
  pdf: { icon: FileText, color: '#f87171', bg: '#2d1515', label: 'PDF' },
  website: { icon: Globe, color: '#60a5fa', bg: '#0f1f35', label: 'Website' },
  youtube: { icon: PlayCircle, color: '#f472b6', bg: '#2d1528', label: 'YouTube' },
}

export default function KnowledgeHealth({ sources }) {
  if (!sources || sources.length === 0) {
    return (
      <div style={{
        backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
        borderRadius: '14px', padding: '24px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 16px' }}>
          Knowledge Base Health
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px' }}>
          <p style={{ color: '#475569', fontSize: '13px' }}>No sources added yet</p>
        </div>
      </div>
    )
  }

  const totalChunks = sources.reduce((sum, s) => sum + s.chunk_count, 0)
  const avgChunks = Math.round(totalChunks / sources.length)
  const maxSource = sources.reduce((a, b) => a.chunk_count > b.chunk_count ? a : b)
  const minSource = sources.reduce((a, b) => a.chunk_count < b.chunk_count ? a : b)

  // Chunks by type
  const chunksByType = { pdf: 0, website: 0, youtube: 0 }
  sources.forEach(s => {
    if (chunksByType[s.source_type] !== undefined) {
      chunksByType[s.source_type] += s.chunk_count
    }
  })

  return (
    <div style={{
      backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
      borderRadius: '14px', padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '28px',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
        Knowledge Base Health
      </h3>

      {/* Avg and Total */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{
          flex: 1, backgroundColor: '#13131f', border: '1px solid #1e1e2e',
          borderRadius: '10px', padding: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <TrendingUp size={13} color="#818cf8" />
            <span style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Avg Chunks
            </span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
            {avgChunks}
          </p>
          <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0' }}>
            per source
          </p>
        </div>
        <div style={{
          flex: 1, backgroundColor: '#13131f', border: '1px solid #1e1e2e',
          borderRadius: '10px', padding: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Layers size={13} color="#34d399" />
            <span style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Chunks
            </span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
            {totalChunks}
          </p>
          <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0' }}>
            across all sources
          </p>
        </div>
      </div>

      {/* Chunks by type bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Chunks by Type
        </p>
        {Object.entries(chunksByType).map(([type, count]) => {
          const config = TYPE_CONFIG[type]
          const Icon = config.icon
          const pct = totalChunks > 0 ? Math.round((count / totalChunks) * 100) : 0
          return (
            <div key={type}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={12} color={config.color} />
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{config.label}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#475569' }}>{count} chunks ({pct}%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#1e1e2e', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  backgroundColor: config.color,
                  borderRadius: '999px', transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Largest and smallest source */}
      {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Source Highlights
        </p>
        {[
          { label: '🏆 Most chunks', source: maxSource },
          { label: '📄 Least chunks', source: minSource },
        ].map(({ label, source }) => {
          const config = TYPE_CONFIG[source.source_type] || TYPE_CONFIG.pdf
          return (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', backgroundColor: '#13131f',
              border: '1px solid #1e1e2e', borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '10px', color: '#475569' }}>{label}</span>
                <span style={{
                  fontSize: '12px', color: '#e2e8f0', fontWeight: '500',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {source.title}
                </span>
              </div>
              <span style={{
                fontSize: '12px', fontWeight: '700', color: config.color,
                backgroundColor: config.bg, padding: '3px 8px',
                borderRadius: '6px', flexShrink: 0, marginLeft: '10px',
              }}>
                {source.chunk_count} chunks
              </span>
            </div>
          )
        })}
      </div> */}
    </div>
  )
}