'use client'

import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const cities: Record<string, { pos: [number, number]; color: string; border?: boolean }> = {
  Monterrey:  { pos: [25.6866, -100.3161], color: '#00C853' },
  Laredo:     { pos: [27.5306,  -99.4803], color: '#00C853', border: true },
  Dallas:     { pos: [32.7767,  -96.7970], color: '#00C853' },
  Houston:    { pos: [29.7604,  -95.3698], color: '#38BDF8' },
}

const monterrey = cities.Monterrey.pos
const laredo    = cities.Laredo.pos
const dallas    = cities.Dallas.pos
const houston   = cities.Houston.pos

export default function HighwayMapInner() {
  return (
    <MapContainer
      center={[29.8, -98.2]}
      zoom={5}
      style={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      attributionControl={false}
    >
      {/* Dark map tiles — no API key needed */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Phase 1 — green: Monterrey → Laredo → Dallas */}
      <Polyline
        positions={[monterrey, laredo, dallas]}
        pathOptions={{ color: '#00C853', weight: 3, dashArray: '10 6', opacity: 0.9 }}
      />

      {/* Phase 2 — blue: Dallas → Houston */}
      <Polyline
        positions={[dallas, houston]}
        pathOptions={{ color: '#38BDF8', weight: 3, dashArray: '10 6', opacity: 0.9 }}
      />

      {/* Phase 3 — orange: Houston → Laredo */}
      <Polyline
        positions={[houston, laredo]}
        pathOptions={{ color: '#FB923C', weight: 3, dashArray: '10 6', opacity: 0.85 }}
      />

      {/* City markers */}
      {Object.entries(cities).map(([name, { pos, color, border }]) => (
        <CircleMarker
          key={name}
          center={pos}
          radius={9}
          pathOptions={{ fillColor: color, color: 'white', weight: 2, fillOpacity: 1 }}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, -12]}
            className="highway-map-tooltip"
          >
            <span style={{ fontWeight: 700, fontSize: 12, color: 'white' }}>{name}</span>
            {border && <span style={{ display: 'block', fontSize: 10, color: '#00C853', marginTop: 1 }}>Cross Border</span>}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
