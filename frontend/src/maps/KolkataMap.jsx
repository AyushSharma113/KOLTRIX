import { useEffect, useMemo, useRef, useState } from 'react'
import { LocateFixed, Maximize2 } from 'lucide-react'
import { GeoJSON, MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import SculptedMapFrame from './SculptedMapFrame.jsx'
import { colorForValue, colorRamps, getQuantileBreaks, indicators } from '../utils/socioEconomicIndicators.js'
import { colorChoices } from '../utils/roadNetwork.js'

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

function WardBoundaries({ data, visible, indicator, rampId, selectedWardNumber, onWardSelect }) {
  const map = useMap()
  const layerRef = useRef(null)
  const hasFittedBounds = useRef(false)
  const breaks = indicator ? getQuantileBreaks(data.features, indicator.field) : []
  const ramp = colorRamps[rampId] ?? colorRamps.red

  useEffect(() => {
    if (!visible || hasFittedBounds.current) return
    const bounds = layerRef.current?.getBounds()
    if (bounds?.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 })
      hasFittedBounds.current = true
    }
  }, [data, map, visible])

  if (!visible) return null

  return (
    <GeoJSON
      ref={layerRef}
      data={data}
      style={(feature) => {
        const properties = feature.properties ?? {}
        const wardNumber = properties.ward_no ?? properties.Ward_No_1
        const selected = selectedWardNumber != null && String(wardNumber) === String(selectedWardNumber)
        const valueColor = indicator
          ? colorForValue(properties[indicator.field], breaks, ramp.colors)
          : '#ef4444'
        return {
          color: selected ? '#ffffff' : indicator ? '#8f1d2c' : '#ef4444',
          weight: selected ? 2.4 : indicator ? 0.9 : 1.5,
          opacity: 0.95,
          fillColor: valueColor,
          fillOpacity: indicator ? 0.76 : 0.025,
        }
      }}
      onEachFeature={(feature, layer) => {
        const properties = feature.properties ?? {}
        const wardNumber = properties.ward_no ?? properties.Ward_No_1
        const wardName = properties.Ward_Name ?? properties.Name
        layer.on('click', () => onWardSelect?.(properties))
        const popup = document.createElement('div')
        const title = document.createElement('strong')
        title.textContent = wardName || (wardNumber != null ? `Ward ${wardNumber}` : 'Kolkata ward')
        popup.appendChild(title)
        if (wardNumber != null) {
          const number = document.createElement('div')
          number.textContent = `Ward ${wardNumber}`
          popup.appendChild(number)
        }
        layer.bindPopup(popup)
      }}
    />
  )
}

function RoadNetwork({ data, visible, roadClassFilter, roadColorId, selectedRoadId, onRoadSelect }) {
  const color = colorChoices[roadColorId]?.color ?? colorChoices.lime.color
  const visibleData = useMemo(() => {
    if (!data) return null
    const features = roadClassFilter === 'all'
      ? data.features
      : data.features.filter(({ properties }) => (properties?.highway || 'unclassified') === roadClassFilter)
    return { ...data, features }
  }, [data, roadClassFilter])

  if (!visible || !visibleData) return null

  return (
    <GeoJSON
      data={visibleData}
      style={(feature) => ({
        color: String(feature.properties?.id) === String(selectedRoadId) ? '#ffffff' : color,
        weight: String(feature.properties?.id) === String(selectedRoadId) ? 4 : 0.85,
        opacity: String(feature.properties?.id) === String(selectedRoadId) ? 1 : 0.48,
      })}
      onEachFeature={(feature, layer) => {
        const properties = feature.properties ?? {}
        layer.on('click', () => onRoadSelect?.(properties))
        const popup = document.createElement('div')
        const title = document.createElement('strong')
        title.textContent = properties.name || `${properties.highway || 'Unclassified'} road`
        popup.appendChild(title)
        const roadType = document.createElement('div')
        roadType.textContent = properties.highway || 'Unclassified'
        popup.appendChild(roadType)
        layer.bindPopup(popup)
      }}
    />
  )
}

function ZoomStatus({ onZoomChange }) {
  useMapEvents({ zoomend: (event) => onZoomChange(event.target.getZoom()) })
  return null
}

export default function KolkataMap({
  showWardBoundaries = false,
  data,
  error = '',
  indicatorId = null,
  rampId = 'red',
  selectedWardNumber = null,
  onWardSelect,
  showRoads = false,
  roadData,
  roadError = '',
  roadClassFilter = 'all',
  roadColorId = 'lime',
  selectedRoadId = null,
  onRoadSelect,
}) {
  const [zoom, setZoom] = useState(12)
  const indicator = indicators.find((item) => item.id === indicatorId) ?? null

  return (
    <section className="map-shell" aria-label="Interactive map of Kolkata">
      <SculptedMapFrame className="leaflet-map-frame">
        <MapContainer center={[22.5726, 88.3639]} zoom={zoom} zoomControl={false} scrollWheelZoom preferCanvas className="leaflet-map" style={{ width: '100%', height: '100%' }}>
          <MapResizeHandler />
          <ZoomStatus onZoomChange={setZoom} />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={tileUrl} />
          {data && <WardBoundaries data={data} visible={showWardBoundaries} indicator={indicator} rampId={rampId} selectedWardNumber={selectedWardNumber} onWardSelect={onWardSelect} />}
          <RoadNetwork data={roadData} visible={showRoads} roadClassFilter={roadClassFilter} roadColorId={roadColorId} selectedRoadId={selectedRoadId} onRoadSelect={onRoadSelect} />
          <ZoomControl position="bottomright" />
        </MapContainer>
      </SculptedMapFrame>
      <div className="map-top-label"><span className="live-dot" /> KOLKATA <span className="coordinates">22.5726° N&nbsp; 88.3639° E</span></div>
      <div className="map-tools"><button aria-label="Locate me" type="button"><LocateFixed size={17} /></button><button aria-label="Fullscreen" type="button"><Maximize2 size={17} /></button></div>
      <div className="map-caption"><span><i /> Live basemap</span><span>OpenStreetMap</span></div>
      <div className="zoom-indicator">ZOOM LEVEL <b>{zoom}</b></div>
      {showWardBoundaries && error && <div className="map-layer-error" role="alert">Ward boundaries failed to load: {error}</div>}
      {showRoads && roadError && <div className="map-layer-error" role="alert">Road data failed to load: {roadError}</div>}
    </section>
  )
}
