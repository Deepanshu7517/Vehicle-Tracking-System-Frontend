export default function StatCard({ label, value, unit, color = '#4f8ef7' }) {
  return (
    <div style={{
      background: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 28, fontWeight: 700, color }}>
        {value ?? '—'}
        {value != null && unit && (
          <span style={{ fontSize: 14, fontWeight: 400, color: '#64748b', marginLeft: 4 }}>
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}