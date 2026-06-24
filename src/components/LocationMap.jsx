import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { getLocation } from '../api';
import 'leaflet/dist/leaflet.css';

export default function LocationMap({ truckId, range }) {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['location', truckId, range],
    queryFn:  () => getLocation(truckId, { range }),
    refetchInterval: 30000,
  });

  const positions = locations
    .filter(l => l.lat && l.lng)
    .map(l => [l.lat, l.lng]);

  const latest = positions[positions.length - 1];
  const center = latest ?? [28.6139, 77.2090];

  return (
    <div style={{
      background: '#1a1d27',
      border: '1px solid #2d3148',
      borderRadius: 12,
      padding: '20px 24px',
    }}>
      <h3 style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, fontWeight: 500 }}>
        Location History
      </h3>

      {isLoading ? (
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          Loading map...
        </div>
      ) : (
        <MapContainer
          key={`${truckId}-${range}`}
          center={center}
          zoom={14}
          style={{ height: 400, borderRadius: 8 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          {positions.length > 1 && (
            <Polyline positions={positions} color="#4f8ef7" weight={3} opacity={0.8} />
          )}
          {latest && (
            <CircleMarker center={latest} radius={10} color="#ef4444" fillColor="#ef4444" fillOpacity={1}>
              <Popup>Latest position</Popup>
            </CircleMarker>
          )}
          {positions.length > 0 && (
            <CircleMarker center={positions[0]} radius={8} color="#22c55e" fillColor="#22c55e" fillOpacity={1}>
              <Popup>Start of period</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      )}
    </div>
  );
}