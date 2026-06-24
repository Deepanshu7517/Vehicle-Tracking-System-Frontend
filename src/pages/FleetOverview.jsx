// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { getTrucks, getAllLive } from '../api';

// // ── Per-type label and color ──────────────────────────────────────────────────
// const TYPE_META = {
//   NPU:    { label: 'Nitrogen Pumping Unit', color: '#4f8ef7' },
//   HOCU:   { label: 'HOCU',                  color: '#f59e0b' },
//   TANKER: { label: 'Tanker',                color: '#a78bfa' },
// };

// // ── Build preview rows per vehicle type ───────────────────────────────────────
// function getLivePreview(live) {
//   if (!live) return [];
//   const type = (live.vehicle_type ?? 'NPU').toUpperCase();

//   if (type === 'HOCU') {
//     return [
//       { label: 'Discharge Pressure', value: live.hocu_discharge_pressure != null ? `${Number(live.hocu_discharge_pressure).toFixed(1)} psi` : '—' },
//       { label: 'Discharge Temp',     value: live.hocu_discharge_temp     != null ? `${Number(live.hocu_discharge_temp).toFixed(1)} °C`  : '—' },
//       { label: 'Hour Meter',         value: live.hour_meter_reading       != null ? `${Number(live.hour_meter_reading).toFixed(1)} hrs`  : '—' },
//       { label: 'Running KM',         value: live.running_km               != null ? `${Number(live.running_km).toFixed(1)} km`           : '—' },
//     ];
//   }

//   if (type === 'TANKER') {
//     return [
//       { label: 'Engine Status', value: live.engine_status != null ? (live.engine_status === 1 ? '🟢  ON' : '🔴  OFF') : '—' },
//       { label: 'Running KM',    value: live.running_km    != null ? `${Number(live.running_km).toFixed(1)} km`         : '—' },
//       { label: 'GPS Speed',     value: live.gps_speed     != null ? `${Number(live.gps_speed).toFixed(1)} km/h`        : '—' },
//       { label: 'GPS Fix',       value: live.gps_fix != null ? (live.gps_fix ? '✅  Fixed' : '❌  No fix')              : '—' },
//     ];
//   }

//   // NPU
//   return [
//     { label: 'Max Pressure',  value: live.max_pumping_pressure    != null ? `${Number(live.max_pumping_pressure).toFixed(0)} psi`           : '—' },
//     { label: 'Flow Rate',     value: live.flow_rate               != null ? `${Number(live.flow_rate).toFixed(1)} m³/min`                   : '—' },
//     { label: 'Disc. Temp',    value: live.discharge_temperature   != null ? `${Number(live.discharge_temperature).toFixed(1)} °C`           : '—' },
//     { label: 'Total N₂',      value: live.total_n2_volume         != null ? `${Number(live.total_n2_volume).toFixed(2)} KL`                 : '—' },
//     { label: 'Disc. Pressure',value: live.discharge_pressure      != null ? `${Number(live.discharge_pressure).toFixed(0)} psi`             : '—' },
//     { label: 'Inj. Rate',     value: live.nitrogen_injection_rate != null ? `${Number(live.nitrogen_injection_rate).toLocaleString()} SCFH` : '—' },
//     { label: 'Cumul. N₂',     value: live.cumulative_n2_quantity  != null ? `${Number(live.cumulative_n2_quantity).toFixed(2)} KL`          : '—' },
//   ];
// }

// // ── Truck card ────────────────────────────────────────────────────────────────
// function TruckCard({ truck, liveData }) {
//   const navigate   = useNavigate();
//   const live       = liveData?.find(l => l.truck_id === truck.id);
//   const type       = (live?.vehicle_type ?? truck.vehicle_type ?? 'NPU').toUpperCase();
//   const meta       = TYPE_META[type] ?? TYPE_META.NPU;
//   const isOnline   = live != null && (Date.now() - new Date(live.updated_at).getTime()) < 5000;
//   const preview    = getLivePreview(live);

//   return (
//     <div
//       onClick={() => navigate(`/truck/${truck.id}`)}
//       style={{
//         background: '#1a1d27',
//         border: `1px solid ${isOnline ? '#1e3a2f' : '#2d3148'}`,
//         borderRadius: 12,
//         padding: 24,
//         cursor: 'pointer',
//         transition: 'border-color 0.2s',
//       }}
//       onMouseEnter={e => e.currentTarget.style.borderColor = meta.color}
//       onMouseLeave={e => e.currentTarget.style.borderColor = isOnline ? '#1e3a2f' : '#2d3148'}
//     >
//       {/* Card header */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
//         <div>
//           <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{truck.id}</div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
//             <span style={{
//               fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
//               background: `${meta.color}22`,
//               color: meta.color,
//               border: `1px solid ${meta.color}44`,
//             }}>
//               {meta.label}
//             </span>
//           </div>
//         </div>
//         <div style={{
//           background: isOnline ? '#0f3d1f' : '#1a1d27',
//           color: isOnline ? '#22c55e' : '#64748b',
//           border: `1px solid ${isOnline ? '#22c55e' : '#2d3148'}`,
//           borderRadius: 20, padding: '3px 12px',
//           fontSize: 11, fontWeight: 600,
//         }}>
//           {isOnline ? '● LIVE' : 'OFFLINE'}
//         </div>
//       </div>

//       {/* Parameters grid */}
//       {live && preview.length > 0 ? (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: type === 'TANKER' ? '1fr 1fr' : 'repeat(3, 1fr)',
//           gap: 8,
//         }}>
//           {preview.map(item => (
//             <div key={item.label} style={{
//               background: '#0f1117',
//               borderRadius: 8,
//               padding: '10px 12px',
//             }}>
//               <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                 {item.label}
//               </div>
//               <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
//                 {item.value}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div style={{ color: '#64748b', fontSize: 13 }}>
//           {isOnline ? 'Receiving data...' : 'No live data'}
//         </div>
//       )}

//       {/* GPS footer */}
//       {live?.lat != null && (
//         <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>
//           📍 {Number(live.lat).toFixed(4)}, {Number(live.lng).toFixed(4)}
//           {live.gps_speed != null && ` · ${Number(live.gps_speed).toFixed(1)} km/h`}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Fleet overview page ───────────────────────────────────────────────────────
// export default function FleetOverview() {
//   const navigate = useNavigate();

//   const { data: trucks = [], isLoading } = useQuery({
//     queryKey:        ['trucks'],
//     queryFn:         getTrucks,
//     refetchInterval: 30000,
//   });

//   const { data: liveData = [] } = useQuery({
//     queryKey:        ['all-live'],
//     queryFn:         getAllLive,
//     refetchInterval: 1000,
//   });

//   // Group trucks by type
//   const grouped = {
//     NPU:    trucks.filter(t => (t.vehicle_type ?? 'NPU').toUpperCase() === 'NPU'),
//     HOCU:   trucks.filter(t => (t.vehicle_type ?? '').toUpperCase()    === 'HOCU'),
//     TANKER: trucks.filter(t => (t.vehicle_type ?? '').toUpperCase()    === 'TANKER'),
//   };

//   return (
//     <div style={{ padding: 32 }}>
//       <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Fleet Overview</h1>
//       <p style={{ color: '#64748b', marginBottom: 32 }}>Live · Click a unit to see full analytics</p>

//       {isLoading && <div style={{ color: '#64748b' }}>Loading fleet...</div>}

//       {/* NPU section */}
//       {grouped.NPU.length > 0 && (
//         <section style={{ marginBottom: 36 }}>
//           <div style={{ fontSize: 12, color: '#4f8ef7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
//             Nitrogen Pumping Units ({grouped.NPU.length})
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
//             {grouped.NPU.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
//           </div>
//         </section>
//       )}

//       {/* HOCU section */}
//       {grouped.HOCU.length > 0 && (
//         <section style={{ marginBottom: 36 }}>
//           <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
//             HOCU Units ({grouped.HOCU.length})
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
//             {grouped.HOCU.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
//           </div>
//         </section>
//       )}

//       {/* Tanker section */}
//       {grouped.TANKER.length > 0 && (
//         <section style={{ marginBottom: 36 }}>
//           <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
//             Tankers ({grouped.TANKER.length})
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
//             {grouped.TANKER.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// // }
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { getTrucks, getAllLive, getVehicleColumns } from '../api';

// // ── Per-type label and color ──────────────────────────────────────────────────
// const TYPE_META = {
//   NPU:    { label: 'Nitrogen Pumping Unit', color: '#4f8ef7' },
//   HOCU:   { label: 'HOCU',                  color: '#f59e0b' },
//   TANKER: { label: 'Tanker',                color: '#a78bfa' },
// };

// // ── Truck card ────────────────────────────────────────────────────────────────
// function TruckCard({ truck, liveData }) {
//   const navigate   = useNavigate();
//   const live       = liveData?.find(l => l.truck_id === truck.id);
//   const type       = (live?.vehicle_type ?? truck.vehicle_type ?? 'NPU').toUpperCase();
//   const meta       = TYPE_META[type] ?? TYPE_META.NPU;
//   const isOnline   = live != null && (Date.now() - new Date(live.updated_at).getTime()) < 5000;
  
//   // Fetch dynamic columns for this vehicle type
//   // const { data: colData } = useQuery({
//   //   queryKey: ['columns', type],
//   //   queryFn:  () => getVehicleColumns(type),
//   //   staleTime: Infinity, // columns don't change at runtime
//   // });

//   // Build preview from dynamic columns
//   const preview = colData?.columns
//     ? colData.columns.slice(0, 6).map(col => ({
//         label: col.column.replace(/_/g, ' '),
//         value: live?.[col.column] != null
//           ? col.type === 'bool'
//             ? live[col.column] === 1 ? '🟢 ON' : '🔴 OFF'
//             : Number(live[col.column]).toLocaleString(undefined, { maximumFractionDigits: 2 })
//           : '—',
//       }))
//     : [];

//   return (
//     <div
//       onClick={() => navigate(`/truck/${truck.id}`)}
//       style={{
//         background: '#1a1d27',
//         border: `1px solid ${isOnline ? '#1e3a2f' : '#2d3148'}`,
//         borderRadius: 12,
//         padding: 24,
//         cursor: 'pointer',
//         transition: 'border-color 0.2s',
//       }}
//       onMouseEnter={e => e.currentTarget.style.borderColor = meta.color}
//       onMouseLeave={e => e.currentTarget.style.borderColor = isOnline ? '#1e3a2f' : '#2d3148'}
//     >
//       {/* Card header */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
//         <div>
//           <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{truck.id}</div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
//             <span style={{
//               fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
//               background: `${meta.color}22`,
//               color: meta.color,
//               border: `1px solid ${meta.color}44`,
//             }}>
//               {meta.label}
//             </span>
//           </div>
//         </div>
//         <div style={{
//           background: isOnline ? '#0f3d1f' : '#1a1d27',
//           color: isOnline ? '#22c55e' : '#64748b',
//           border: `1px solid ${isOnline ? '#22c55e' : '#2d3148'}`,
//           borderRadius: 20, padding: '3px 12px',
//           fontSize: 11, fontWeight: 600,
//         }}>
//           {isOnline ? '● LIVE' : 'OFFLINE'}
//         </div>
//       </div>

//       {/* Parameters grid */}
//       {live && preview.length > 0 ? (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: type === 'TANKER' ? '1fr 1fr' : 'repeat(3, 1fr)',
//           gap: 8,
//         }}>
//           {preview.map(item => (
//             <div key={item.label} style={{
//               background: '#0f1117',
//               borderRadius: 8,
//               padding: '10px 12px',
//             }}>
//               <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                 {item.label}
//               </div>
//               <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
//                 {item.value}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div style={{ color: '#64748b', fontSize: 13 }}>
//           {isOnline ? 'Receiving data...' : 'No live data'}
//         </div>
//       )}

//       {/* GPS footer */}
//       {live?.lat != null && (
//         <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>
//           📍 {Number(live.lat).toFixed(4)}, {Number(live.lng).toFixed(4)}
//           {live.gps_speed != null && ` · ${Number(live.gps_speed).toFixed(1)} km/h`}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Fleet overview page ───────────────────────────────────────────────────────
// export default function FleetOverview() {
//   const navigate = useNavigate();

//   const { data: trucks = [], isLoading } = useQuery({
//     queryKey:        ['trucks'],
//     queryFn:         getTrucks,
//     refetchInterval: 30000,
//   });

//   const { data: liveData = [] } = useQuery({
//     queryKey:        ['all-live'],
//     queryFn:         getAllLive,
//     refetchInterval: 1000,
//   });

//   // Group trucks by type
//   const grouped = {
//     NPU:    trucks.filter(t => (t.vehicle_type ?? 'NPU').toUpperCase() === 'NPU'),
//     HOCU:   trucks.filter(t => (t.vehicle_type ?? '').toUpperCase()    === 'HOCU'),
//     TANKER: trucks.filter(t => (t.vehicle_type ?? '').toUpperCase()    === 'TANKER'),
//   };

//   return (
//     <div style={{ padding: 32 }}>
//       <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Fleet Overview</h1>
//       <p style={{ color: '#64748b', marginBottom: 32 }}>Live · Click a unit to see full analytics</p>

//       {isLoading && <div style={{ color: '#64748b' }}>Loading fleet...</div>}

//       {/* NPU section */}
//       {grouped.NPU.length > 0 && (
//         <section style={{ marginBottom: 36 }}>
//           <div style={{ fontSize: 12, color: '#4f8ef7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
//             Nitrogen Pumping Units ({grouped.NPU.length})
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
//             {grouped.NPU.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
//           </div>
//         </section>
//       )}

//       {/* HOCU section */}
//       {grouped.HOCU.length > 0 && (
//         <section style={{ marginBottom: 36 }}>
//           <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
//             HOCU Units ({grouped.HOCU.length})
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
//             {grouped.HOCU.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
//           </div>
//         </section>
//       )}

//       {/* Tanker section */}
//       {grouped.TANKER.length > 0 && (
//         <section style={{ marginBottom: 36 }}>
//           <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
//             Tankers ({grouped.TANKER.length})
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
//             {grouped.TANKER.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getTrucks, getAllLive, getVehicleColumns } from '../api';

// ── Per-type label and color ──────────────────────────────────────────────────
const TYPE_META = {
  NPU:    { label: 'Nitrogen Pumping Unit', color: '#4f8ef7' },
  HOCU:   { label: 'HOCU',                  color: '#f59e0b' },
  TANKER: { label: 'Tanker',                color: '#a78bfa' },
};

// ── Truck card ────────────────────────────────────────────────────────────────
function TruckCard({ truck, liveData }) {
  const navigate   = useNavigate();
  const live       = liveData?.find(l => l.truck_id === truck.id);
  const type       = (live?.vehicle_type ?? truck.vehicle_type ?? 'NPU').toUpperCase();
  const meta       = TYPE_META[type] ?? TYPE_META.NPU;
  const isOnline   = live != null && (Date.now() - new Date(live.updated_at).getTime()) < 35000; // Increased online threshold to match 30s polling
  
  // Fetch dynamic columns for this vehicle type (UNCOMMENTED)
  const { data: colData } = useQuery({
    queryKey: ['columns', type],
    queryFn:  () => getVehicleColumns(type),
    staleTime: Infinity, // columns don't change at runtime
  });

  // Build preview from dynamic columns
  const preview = colData?.columns
    ? colData.columns.slice(0, 6).map(col => ({
        label: col.column.replace(/_/g, ' '),
        value: live?.[col.column] != null
          ? col.type === 'bool'
            ? live[col.column] === 1 ? '🟢 ON' : '🔴 OFF'
            : Number(live[col.column]).toLocaleString(undefined, { maximumFractionDigits: 2 })
          : '—',
      }))
    : [];

  return (
    <div
      onClick={() => navigate(`/truck/${truck.id}`)}
      style={{
        background: '#1a1d27',
        border: `1px solid ${isOnline ? '#1e3a2f' : '#2d3148'}`,
        borderRadius: 12,
        padding: 24,
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = meta.color}
      onMouseLeave={e => e.currentTarget.style.borderColor = isOnline ? '#1e3a2f' : '#2d3148'}
    >
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{truck.id}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
              background: `${meta.color}22`,
              color: meta.color,
              border: `1px solid ${meta.color}44`,
            }}>
              {meta.label}
            </span>
          </div>
        </div>
        <div style={{
          background: isOnline ? '#0f3d1f' : '#1a1d27',
          color: isOnline ? '#22c55e' : '#64748b',
          border: `1px solid ${isOnline ? '#22c55e' : '#2d3148'}`,
          borderRadius: 20, padding: '3px 12px',
          fontSize: 11, fontWeight: 600,
        }}>
          {isOnline ? '● LIVE' : 'OFFLINE'}
        </div>
      </div>

      {/* Parameters grid */}
      {live && preview.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: type === 'TANKER' ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: 8,
        }}>
          {preview.map(item => (
            <div key={item.label} style={{
              background: '#0f1117',
              borderRadius: 8,
              padding: '10px 12px',
            }}>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: '#64748b', fontSize: 13 }}>
          {isOnline ? 'Receiving data...' : 'No live data'}
        </div>
      )}

      {/* GPS footer */}
      {live?.lat != null && (
        <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>
          📍 {Number(live.lat).toFixed(4)}, {Number(live.lng).toFixed(4)}
          {live.gps_speed != null && ` · ${Number(live.gps_speed).toFixed(1)} km/h`}
        </div>
      )}
    </div>
  );
}

// ── Fleet overview page ───────────────────────────────────────────────────────
export default function FleetOverview() {
  const navigate = useNavigate();

  const { data: trucks = [], isLoading } = useQuery({
    queryKey:        ['trucks'],
    queryFn:         getTrucks,
    refetchInterval: 30000,
  });

  const { data: liveData = [] } = useQuery({
    queryKey:        ['all-live'],
    queryFn:         getAllLive,
    refetchInterval: 30000, // OPTIMIZED: Was 1000, now checks every 30s
  });

  // Group trucks by type
  const grouped = {
    NPU:    trucks.filter(t => (t.vehicle_type ?? 'NPU').toUpperCase() === 'NPU'),
    HOCU:   trucks.filter(t => (t.vehicle_type ?? '').toUpperCase()    === 'HOCU'),
    TANKER: trucks.filter(t => (t.vehicle_type ?? '').toUpperCase()    === 'TANKER'),
  };

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Fleet Overview</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>Live · Click a unit to see full analytics</p>

      {isLoading && <div style={{ color: '#64748b' }}>Loading fleet...</div>}

      {/* NPU section */}
      {grouped.NPU.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 12, color: '#4f8ef7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            Nitrogen Pumping Units ({grouped.NPU.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {grouped.NPU.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
          </div>
        </section>
      )}

      {/* HOCU section */}
      {grouped.HOCU.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            HOCU Units ({grouped.HOCU.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {grouped.HOCU.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
          </div>
        </section>
      )}

      {/* Tanker section */}
      {grouped.TANKER.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            Tankers ({grouped.TANKER.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {grouped.TANKER.map(t => <TruckCard key={t.id} truck={t} liveData={liveData} />)}
          </div>
        </section>
      )}
    </div>
  );
}