import React from 'react';

const SYSTEM_KEYS = new Set([
  '_id', '__v', 'truck_id', 'vehicle_type', 'ts', 'updated_at',
  'lat', 'lng', 'gps_speed', 'gps_heading', 'gps_fix',
  'gps_satellites', 'gps_accuracy'
]);

function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function formatValue(val) {
  if (val == null) return '—';
  if (typeof val === 'boolean' || val === 1 || val === 0) {
    return val === true || val === 1 ? 'ON' : 'OFF';
  }
  return Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function statusColor(val) {
  if (typeof val === 'boolean' || val === 1 || val === 0) {
    return val === true || val === 1 ? '#22c55e' : '#ef4444'; 
  }
  return '#e2e8f0'; 
}

const TYPE_LABEL = { NPU: 'Nitrogen Pumping Unit', HOCU: 'HOCU', TANKER: 'Tanker' };
const TYPE_COLOR = { NPU: '#4f8ef7', HOCU: '#f59e0b', TANKER: '#4f8ef7' }; 

export default function LiveDataTable({ live }) {
  const vehicleType = live?.vehicle_type ?? 'NPU';
  const isOnline = live && (Date.now() - new Date(live.updated_at).getTime()) < 35000;

  // Extract unique dynamic keys to prevent clones
  const rawParams = live ? Object.keys(live).filter(k => !SYSTEM_KEYS.has(k)) : [];
  console.log(rawParams);
  const dynamicParams = [...new Set(rawParams)];

  return (
    <div style={{
      background: '#1a1d27',
      border: `1px solid ${isOnline ? '#1e3a2f' : '#2d3148'}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid #2d3148',
        background: '#141720',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: isOnline ? '#22c55e' : '#ef4444',
            boxShadow: isOnline ? '0 0 6px #22c55e' : 'none',
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Live Data</span>
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 10,
            background: `${TYPE_COLOR[vehicleType]}22`,
            color: TYPE_COLOR[vehicleType],
            fontWeight: 600, border: `1px solid ${TYPE_COLOR[vehicleType]}44`,
          }}>
            {TYPE_LABEL[vehicleType]}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {live?.lat && (
            <span style={{ fontSize: 11, color: '#64748b' }}>
              📍 {Number(live.lat).toFixed(5)}, {Number(live.lng).toFixed(5)}
            </span>
          )}
          {live?.ts && (
            <span style={{ fontSize: 11, color: '#64748b' }}>
              {new Date(live.ts).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Parameters */}
      {!live ? (
        <div style={{ padding: 24, color: '#64748b', textAlign: 'center', fontSize: 13 }}>
          Waiting for live data...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
          gap: 0,
        }}>
          {dynamicParams.map((key, i) => (
            <div key={key} style={{
              padding: '16px 14px',
              borderRight: i < dynamicParams.length - 1 ? '1px solid #2d3148' : 'none',
              borderBottom: '1px solid #2d3148',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 10, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: 0.8,
                marginBottom: 8,
              }}>
                {formatLabel(key)}
              </div>
              <div style={{
                fontSize: 22, fontWeight: 700,
                color: statusColor(live[key]),
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatValue(live[key])}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}