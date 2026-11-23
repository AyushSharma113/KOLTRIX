import { useState } from 'react'
import { Activity, Building2, Grid2X2, Layers3, Map, MapPinned, Settings, Shield, Trees, BusFront, GraduationCap, Hospital, ChevronDown, SlidersHorizontal, Maximize2, LocateFixed } from 'lucide-react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import SculptedMapFrame from './maps/SculptedMapFrame.jsx'
import CivicNavbar from './components/CivicNavbar.jsx'
import 'leaflet/dist/leaflet.css'
import './App.css'

const categories = [
  { label: 'Ward boundaries', icon: MapPinned },
  { label: 'Hospitals', icon: Hospital },
  { label: 'Education', icon: GraduationCap },
  { label: 'Transport', icon: BusFront },
]

function App() {
  const [zoom, setZoom] = useState(12)
  return (
    <main className="dashboard">
      <CivicNavbar />
      <nav className="rail" aria-label="Main navigation">
        <button className="rail-active" aria-label="Dashboard"><Grid2X2 size={19}/></button><button aria-label="City Explorer"><MapPinned size={19}/></button><button aria-label="Spatial Analytics"><Activity size={19}/></button><button aria-label="Data Explorer"><Layers3 size={19}/></button><div className="rail-spacer"/><button aria-label="Settings"><Settings size={19}/></button>
      </nav>
      <aside className="layers-panel">
        <div className="panel-heading"><div><span className="eyebrow">EXPLORE</span><h2>Map layers</h2></div><button aria-label="Layer settings"><SlidersHorizontal size={16}/></button></div>
        <div className="section-label">BASE MAP</div>
        <button className="layer-row selected"><span className="layer-symbol boundary"><Map size={15}/></span><span>OpenStreetMap</span><span className="switch on"/></button>
        <div className="section-label with-line">KOLKATA DATA <span>COMING SOON</span></div>
        {categories.map(({label, icon: Icon}) => <div className="layer-row disabled" key={label}><span className="layer-symbol"><Icon size={15}/></span><span>{label}</span><span className="switch"/></div>)}
        <div className="layer-note"><span className="note-dot"/><p>Ward and facility layers will be added after data preparation.</p></div>
        <div className="panel-bottom"><div className="section-label">MAP STYLE</div><button className="select-row"><span><Map size={15}/> Dark streets</span><ChevronDown size={15}/></button><div className="section-label">VIEW</div><button className="select-row"><span><Building2 size={15}/> Kolkata, India</span><ChevronDown size={15}/></button></div>
      </aside>
      <section className="map-shell" aria-label="Interactive map of Kolkata">
        <SculptedMapFrame className="leaflet-map-frame">
          <MapContainer center={[22.5726, 88.3639]} zoom={zoom} zoomControl={false} scrollWheelZoom className="leaflet-map">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <ZoomControl position="bottomright" />
          </MapContainer>
        </SculptedMapFrame>
        <div className="map-top-label"><span className="live-dot"/> KOLKATA <span className="coordinates">22.5726° N&nbsp; 88.3639° E</span></div>
        <div className="map-tools"><button aria-label="Locate me"><LocateFixed size={17}/></button><button aria-label="Fullscreen"><Maximize2 size={17}/></button></div>
        <div className="map-caption"><span><i/> Live basemap</span><span>OpenStreetMap</span></div>
        <div className="zoom-indicator">ZOOM LEVEL <b>{zoom}</b></div>
      </section>
      <aside className="analytics-panel">
        <div className="panel-heading right-heading"><div><span className="eyebrow">CITY OVERVIEW</span><h2>Welcome to Kolkata</h2></div><button aria-label="More overview options"><ChevronDown size={16}/></button></div>
        <div className="tab-row"><button className="active-tab">Overview</button><button>Demographics</button><button>Infrastructure</button></div>
        <div className="intro-card"><div className="intro-icon"><MapPinned size={19}/></div><div><strong>Explore the city spatially</strong><p>Pan and zoom the map to explore Kolkata. Verified ward data is coming next.</p></div></div>
        <div className="stats-title">DATA SNAPSHOT <span>IN PREPARATION</span></div>
        <div className="stat-placeholder"><div className="stat-glyph"><Layers3 size={17}/></div><div><b>Ward statistics</b><small>Will appear when data is connected</small></div></div>
        <div className="stat-placeholder"><div className="stat-glyph blue"><Trees size={17}/></div><div><b>Public facilities</b><small>Facility data planned for a later step</small></div></div>
        <div className="insight-card"><span className="insight-mark">✦</span><div><b>Built for spatial insight</b><p>Demographics, infrastructure, and accessibility will be introduced step by step.</p></div></div>
        <div className="panel-footer"><Shield size={14}/> Data sources and methods will be documented</div>
      </aside>
    </main>
  )
}

export default App
