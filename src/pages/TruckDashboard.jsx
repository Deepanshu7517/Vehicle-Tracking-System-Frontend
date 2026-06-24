import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTruckLive, getTelemetry, getStats, getVehicleColumns, downloadExcel } from "../api";
import RangeSelector from "../components/RangeSelector";
import StatCard from "../components/StatCard";
import TelemetryChart from "../components/TelemetryChart";
import LocationMap from "../components/LocationMap";
import LiveDataTable from "../components/LiveDataTable";

// Cyber-Grid color sequence 
const CHART_COLORS = ['#4f8ef7', '#0ea5e9', '#0284c7', '#38bdf8', '#02c39a', '#0d9488'];

function formatMetricLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export default function TruckDashboard() {
  const { truckId } = useParams();
  const navigate = useNavigate();
  const [range, setRange] = useState("24h");

  const { data: live } = useQuery({ queryKey: ["live", truckId], queryFn: () => getTruckLive(truckId), refetchInterval: 30000 });
  const { data: telemetry = [], isLoading: isTelemetryLoading } = useQuery({ queryKey: ["telemetry", truckId, range], queryFn: () => getTelemetry(truckId, { range }), refetchInterval: 30000 });
  const { data: stats } = useQuery({ queryKey: ["stats", truckId, range], queryFn: () => getStats(truckId, range), refetchInterval: 30000 });
  
  const { data: colData } = useQuery({
    queryKey: ['columns', live?.vehicle_type ?? 'NPU'],
    queryFn: () => getVehicleColumns(live?.vehicle_type ?? 'NPU'),
    staleTime: Infinity,
    enabled: !!live?.vehicle_type,
  });

  // Extract unique metric keys to prevent clones
  const rawStats = stats ? Object.keys(stats).filter(key => !['truck_id', 'vehicle_type', 'total_records'].includes(key)) : [];
  const dynamicStatKeys = [...new Set(rawStats)];

  // Deduplicate columns to prevent cloned charts
  const uniqueColumns = colData?.columns ? Array.from(new Map(colData.columns.map(item => [item.column, item])).values()) : [];

  return (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, marginBottom: 8, padding: 0 }}>
            ← Fleet overview
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{truckId}</h1>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <RangeSelector value={range} onChange={setRange} />
          <button onClick={() => downloadExcel(truckId, range)} style={{
              padding: "6px 16px", borderRadius: 8, border: "1px solid #2d3148",
              background: "#1a1d27", color: "#94a3b8", fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            ⬇ Export Excel
          </button>
        </div>
      </div>

      {/* Live Data */}
      <LiveDataTable live={live} />

      {/* Historical KPI Cards */}
      {stats && dynamicStatKeys.length > 0 && (
        <div>
          <h2 style={{ fontSize: 14, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            Historical Summary — {range}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {dynamicStatKeys.map((metricKey, index) => (
              <StatCard
                key={`stat-${metricKey}`}
                label={formatMetricLabel(metricKey)}
                value={stats[metricKey]}
                color={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Historical Charts */}
      {!isTelemetryLoading && uniqueColumns.length > 0 && (
        <div>
          <h2 style={{ fontSize: 14, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            Historical Charts — {range}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {uniqueColumns.map((col, i) => (
              <TelemetryChart
                key={`chart-${col.column}`}
                data={telemetry}
                dataKey={col.column}
                label={col.column.replace(/_/g, ' ')}
                color={CHART_COLORS[i % CHART_COLORS.length]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Location Map */}
      <LocationMap truckId={truckId} range={range} />
    </div>
  );
}