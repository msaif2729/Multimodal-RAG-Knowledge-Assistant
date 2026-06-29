export default function StatsCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div style={{
      backgroundColor: '#0f0f17',
      border: '1px solid #1e1e2e',
      borderRadius: '14px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        backgroundColor: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 2px' }}>
          {value}
        </p>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          {label}
        </p>
      </div>
    </div>
  )
}