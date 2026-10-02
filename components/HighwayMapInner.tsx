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

/* Hubs that sit outside the Mexico–Texas corridor view: the rest of the
   network: the I-10 West corridor and Panama. Same green as the corridor — one network. */
const outlyingHubs: { name: string; sub: string; pos: [number, number] }[] = [
  { name: 'I-10 West',   sub: 'Phase 3 · 3 Green Hubs', pos: [34.0, -114.0] },
  { name: 'Panama',      sub: 'Open now · 4 hub sites', pos: [8.98,  -79.52] },
]

/* Small locator map, shown over the corner of the corridor map so the two
   markets that are off the corridor are still visible on the page. */
function NetworkInset() {
  return (
    <div className="hidden md:block absolute bottom-4 left-4 z-[1000] w-[212px] rounded-xl overflow-hidden border border-white/10 bg-navy-900/85 backdrop-blur-sm">
      <p className="text-white/30 text-[9px] uppercase tracking-[0.18em] px-3 pt-2.5 pb-1.5">
        Rest of the network
      </p>
      <div style={{ height: 116 }}>
        <MapContainer
          bounds={[[6.5, -124.5], [39.5, -76.5]]}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          keyboard={false}
          attributionControl={false}
          zoomSnap={0}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            maxZoom={16}
          />
          {outlyingHubs.map(h => (
            <CircleMarker
              key={h.name}
              center={h.pos}
              radius={5}
              pathOptions={{ fillColor: '#00C853', color: 'white', weight: 1.5, fillOpacity: 1 }}
            />
          ))}
        </MapContainer>
      </div>
      <div className="px-3 py-2.5 space-y-1.5 border-t border-white/[0.07]">
        {outlyingHubs.map(h => (
          <div key={h.name} className="flex items-start gap-2">
            <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#00C853' }} />
            <span className="leading-tight">
              <span className="block text-white/75 text-[10px] font-semibold">{h.name}</span>
              <span className="block text-white/35 text-[9px]">{h.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HighwayMapInner({ networkInset = false }: { networkInset?: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
      attributionControl={true}
    >
      {/* Basemap: Esri "Dark Gray Canvas" (keyless public tile service).
          CARTO's free basemaps.cartocdn.com endpoint began requiring an API
          key and now returns "API KEY REQUIRED" placeholder tiles, which is
          why the map rendered as a watermark grid. */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri'
        maxZoom={16}
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

      {networkInset && <NetworkInset />}
    </div>
  )
}
