import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { format } from 'date-fns';

export default function TelemetryChart({ data, dataKey, label, color, unit }) {
  const chartData = [...data].reverse().map(r => ({
    ...r,
    time: format(new Date(r.ts), 'HH:mm'),
  }));

  return (
    <div style={{
      background: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: 12,
      padding: '20px 24px',
    }}>
      <h3 style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, fontWeight: 500 }}>
        {label}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#64748b' }}
            interval="preserveStartEnd"
            stroke="#2d3148"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            stroke="#2d3148"
            unit={unit}
          />
          <Tooltip
            contentStyle={{
              background: '#0f1117',
              border: '1px solid #2d3148',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}