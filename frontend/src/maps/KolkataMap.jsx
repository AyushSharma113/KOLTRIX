import { useEffect, useState } from 'react'
import { LocateFixed, Maximize2 } from 'lucide-react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import SculptedMapFrame from './SculptedMapFrame.jsx'

const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY?.trim()
const tileUrl = cartoApiKey
  ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${encodeURIComponent(cartoApiKey)}`
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

function MapResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => map.invalidateSize({ pan: false }))
    })
    resizeObserver.observe(container)
    requestAnimationFrame(() => map.invalidateSize({ pan: false }))
    return () => resizeObserver.disconnect()
  }, [map])

  return null
}

export default function KolkataMap() {
  const [zoom, setZoom] = useState(12)

  return (
    <section className="map-shell" aria-label="Interactive map of Kolkata">
      <SculptedMapFrame className="leaflet-map-frame">
        <MapContainer center={[22.5726, 88.3639]} zoom={zoom} zoomControl={false} scrollWheelZoom className="leaflet-map" style={{ width: '100%', height: '100%' }}>
          <MapResizeHandler />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={tileUrl} />
          <ZoomControl position="bottomright" />
        </MapContainer>
      </SculptedMapFrame>
      <div className="map-top-label"><span className="live-dot" /> KOLKATA <span className="coordinates">22.5726° N&nbsp; 88.3639° E</span></div>
      <div className="map-tools"><button aria-label="Locate me" type="button"><LocateFixed size={17} /></button><button aria-label="Fullscreen" type="button"><Maximize2 size={17} /></button></div>
      <div className="map-caption"><span><i /> Live basemap</span><span>OpenStreetMap</span></div>
      <div className="zoom-indicator">ZOOM LEVEL <b>{zoom}</b></div>
    </section>
  )
}
