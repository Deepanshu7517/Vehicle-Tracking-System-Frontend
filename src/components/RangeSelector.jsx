const RANGES = [
  { label: 'Last 24h',      value: '24h' },
  { label: 'Last week',     value: '1w'  },
  { label: 'Last quarter',  value: '1q'  },
  { label: 'Last year',     value: '1y'  },
];

export default function RangeSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {RANGES.map(r => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          style={{
            padding: '6px 16px',
            borderRadius: 8,
            border: '1px solid',
            borderColor: value === r.value ? '#4f8ef7' : '#2d3148',
            background:  value === r.value ? '#1a3a6e' : '#1a1d27',
            color:       value === r.value ? '#4f8ef7' : '#94a3b8',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: value === r.value ? 600 : 400,
            transition: 'all 0.15s',
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}