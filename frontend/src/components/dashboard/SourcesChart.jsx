import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FileText, Globe, PlayCircle } from 'lucide-react'

const COLORS = {
  pdf: '#f87171',
  website: '#60a5fa',
  youtube: '#f472b6',
}

const LABELS = {
  pdf: 'PDF',
  website: 'Website',
  youtube: 'YouTube',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#13131f',
        border: '1px solid #1e1e2e',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        color: '#e2e8f0',
      }}>
        <p style={{ margin: 0 }}>
          {LABELS[payload[0].name]}: <strong>{payload[0].value}</strong>
        </p>
      </div>
    )
  }
  return null
}

export default function SourcesChart({ byType }) {
  const data = Object.entries(byType)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: key, value }))

  if (data.length === 0) {
    return (
      <div style={{
        backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
        borderRadius: '14px', padding: '24px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 20px' }}>
          Sources Breakdown
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px' }}>
          <p style={{ color: '#475569', fontSize: '13px' }}>No sources added yet</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#0f0f17', border: '1px solid #1e1e2e',
      borderRadius: '14px', padding: '24px',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', margin: '0 0 20px' }}>
        Sources Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                {LABELS[value]}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Stats below chart */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {Object.entries(byType).map(([type, count]) => {
          const icons = { pdf: FileText, website: Globe, youtube: PlayCircle }
          const Icon = icons[type]
          return (
            <div key={type} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#13131f', borderRadius: '10px', padding: '10px 12px',
              border: '1px solid #1e1e2e',
            }}>
              <Icon size={14} color={COLORS[type]} />
              <div>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>{count}</p>
                <p style={{ fontSize: '10px', color: '#475569', margin: 0, textTransform: 'uppercase' }}>{LABELS[type]}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}