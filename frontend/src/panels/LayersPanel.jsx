import {
  BusFront,
  Building2,
  ChevronDown,
  GraduationCap,
  Hospital,
  Map,
  MapPinned,
  SlidersHorizontal,
} from 'lucide-react'

const categories = [
  { label: 'Hospitals', icon: Hospital },
  { label: 'Education', icon: GraduationCap },
  { label: 'Transport', icon: BusFront },
]

export default function LayersPanel({ wardBoundariesEnabled, onWardBoundariesToggle }) {
  return (
    <aside className="layers-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">EXPLORE</span><h2>Map layers</h2></div>
        <button aria-label="Layer settings" type="button"><SlidersHorizontal size={16} /></button>
      </div>
      <div className="section-label">BASE MAP</div>
      <button className="layer-row selected" type="button">
        <span className="layer-symbol boundary"><Map size={15} /></span>
        <span>OpenStreetMap</span><span className="switch on" />
      </button>
      <div className="section-label with-line">KOLKATA DATA <span>COMING SOON</span></div>
      <button
        className={`layer-row ward-layer-toggle${wardBoundariesEnabled ? ' enabled' : ''}`}
        type="button"
        role="switch"
        aria-checked={wardBoundariesEnabled}
        onClick={onWardBoundariesToggle}
      >
        <span className="layer-symbol"><MapPinned size={15} /></span>
        <span>Ward boundaries</span>
        <span className={`switch${wardBoundariesEnabled ? ' on' : ''}`} />
      </button>
      {categories.map(({ label, icon: Icon }) => (
        <div className="layer-row disabled" key={label}>
          <span className="layer-symbol"><Icon size={15} /></span>
          <span>{label}</span><span className="switch" />
        </div>
      ))}
      <div className="layer-note"><span className="note-dot" /><p>Ward and facility layers will be added after data preparation.</p></div>
      <div className="panel-bottom">
        <div className="section-label">MAP STYLE</div>
        <button className="select-row" type="button"><span><Map size={15} /> Dark streets</span><ChevronDown size={15} /></button>
        <div className="section-label">VIEW</div>
        <button className="select-row" type="button"><span><Building2 size={15} /> Kolkata, India</span><ChevronDown size={15} /></button>
      </div>
    </aside>
  )
}
