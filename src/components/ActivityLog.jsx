import { useQuery } from '@tanstack/react-query';
import { getAllLive } from '../api';

export default function ActivityLog({ collapsed, onToggle }) {
  const { data: liveData = [], dataUpdatedAt, isError } = useQuery({
    queryKey:        ['all-live'],
    queryFn:         getAllLive,
    refetchInterval: 3000,
  });

  const onlineCount  = liveData.filter(l =>
    l.updated_at && (Date.now() - new Date(l.updated_at).getTime()) < 10000
  ).length;
  const offlineCount = liveData.length - onlineCount;
  const lastUpdate   = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  const statusColor = isError ? '#ef4444'
    : onlineCount === 0 ? '#f59e0b'
    : '#22c55e';

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20,
      width: collapsed ? 200 : 340,
      background: '#141720', border: '1px solid #2d3148',
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: 1000, transition: 'width 0.2s',
    }}>
      {/* Header */}
      <div onClick={onToggle} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 14px', background: '#0f1117', cursor: 'pointer',
        borderBottom: collapsed ? 'none' : '1px solid #2d3148',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: statusColor, boxShadow: `0 0 6px ${statusColor}`,
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
            Live Feed
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {onlineCount > 0 && (
            <span style={{ fontSize: 10, background: '#166534', color: '#22c55e', padding: '1px 6px', borderRadius: 8 }}>
              {onlineCount} online
            </span>
          )}
          {offlineCount > 0 && (
            <span style={{ fontSize: 10, background: '#78450f', color: '#f59e0b', padding: '1px 6px', borderRadius: 8 }}>
              {offlineCount} offline
            </span>
          )}
          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>
            {collapsed ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div style={{ padding: 14 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>
            Last update: <span style={{ color: '#94a3b8' }}>{lastUpdate}</span>
          </div>
          {liveData.length === 0 ? (
            <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '8px 0' }}>
              {isError ? '❌ Connection error' : 'No units connected'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {liveData.map(unit => {
                const age      = unit.updated_at
                  ? Math.floor((Date.now() - new Date(unit.updated_at).getTime()) / 1000)
                  : null;
                const isOnline = age !== null && age < 10;
                return (
                  <div key={unit.truck_id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 10px', background: '#1a1d27',
                    borderRadius: 8, border: '1px solid #2d3148',
                  }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
                        {unit.truck_id}
                      </span>
                      <span style={{ fontSize: 10, color: '#64748b', marginLeft: 6 }}>
                        {unit.vehicle_type}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#64748b' }}>
                        {age !== null ? `${age}s ago` : '—'}
                      </span>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: isOnline ? '#22c55e' : '#ef4444',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}