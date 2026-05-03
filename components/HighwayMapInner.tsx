'use client'

import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

/* ─── City definitions ──────────────────────────────────────────────────── */
type CityDef = {
  name: string
  pos: [number, number]
  color: string
  dir: 'left' | 'right' | 'bottom' | 'top'
  border: boolean
  waypoint: boolean
}

/* Main corridor — green */
const corridorCities: CityDef[] = [
  { name: 'Monterrey',   pos: [25.6866, -100.3161], color: '#00C853', dir: 'bottom', border: false, waypoint: false },
  { name: 'Laredo',      pos: [27.5306,  -99.4803], color: '#00C853', dir: 'left',   border: true,  waypoint: false },
  { name: 'San Antonio', pos: [29.4241,  -98.4936], color: '#00C853', dir: 'left',   border: false, waypoint: true  },
  { name: 'Temple',      pos: [31.0982,  -97.3428], color: '#00C853', dir: 'left',   border: false, waypoint: true  },
  { name: 'Dallas',      pos: [32.7767,  -96.7970], color: '#00C853', dir: 'top',    border: false, waypoint: false },
]

/* Texas Triangle extension — sky blue */
const triangleCities: CityDef[] = [
  { name: 'Houston',     pos: [29.7604,  -95.3698], color: '#38BDF8', dir: 'right',  border: false, waypoint: false },
]

const allCities = [...corridorCities, ...triangleCities]

const [mty, lrd, sat, tpl, dal] = corridorCities.map(c => c.pos)
const [hou] = triangleCities.map(c => c.pos)

export default function HighwayMapInner() {
  return (
    <MapContainer
      center={[29.4, -97.8]}
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
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />

      {/* Main corridor: Monterrey → Laredo → San Antonio → Temple → Dallas */}
      <Polyline positions={[mty, lrd, sat, tpl, dal]} pathOptions={{ color: '#00C853', weight: 8,   opacity: 0.12 }} />
      <Polyline positions={[mty, lrd, sat, tpl, dal]} pathOptions={{ color: '#00C853', weight: 2.5, opacity: 0.95, dashArray: '8 5' }} />

      {/* Texas Triangle: Dallas → Houston → Laredo */}
      <Polyline positions={[dal, hou, lrd]} pathOptions={{ color: '#38BDF8', weight: 8,   opacity: 0.10 }} />
      <Polyline positions={[dal, hou, lrd]} pathOptions={{ color: '#38BDF8', weight: 2.5, opacity: 0.85, dashArray: '6 6' }} />

      {/* City markers + labels */}
      {allCities.map(city => (
        <CircleMarker
          key={city.name}
          center={city.pos}
          radius={city.waypoint ? 5 : 8}
          pathOptions={{
            fillColor: city.color,
            color: city.waypoint ? 'rgba(255,255,255,0.35)' : 'white',
            weight: city.waypoint ? 1.5 : 2,
            fillOpacity: city.waypoint ? 0.6 : 1,
          }}
        >
          <Tooltip
            permanent
            direction={city.dir}
            offset={
              city.dir === 'left'   ? [-12, 0] :
              city.dir === 'right'  ? [12, 0]  :
              city.dir === 'bottom' ? [0, 8]   :
                                      [0, -8]
            }
            className="highway-map-tooltip"
          >
            <span style={{ fontWeight: city.waypoint ? 500 : 700, fontSize: city.waypoint ? 10 : 12, color: city.waypoint ? 'rgba(255,255,255,0.5)' : '#fff' }}>
              {city.name}
            </span>
            {city.border && (
              <span style={{ display: 'block', fontSize: 9, color: '#00C853', marginTop: 1, letterSpacing: '0.05em' }}>
                Border Crossing
              </span>
            )}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
