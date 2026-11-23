import { ChevronDown, Layers3, MapPinned, Shield, Trees } from 'lucide-react'

export default function CityOverviewPanel() {
  return (
    <aside className="analytics-panel">
      <div className="panel-heading right-heading">
        <div><span className="eyebrow">CITY OVERVIEW</span><h2>Welcome to Kolkata</h2></div>
        <button aria-label="More overview options" type="button"><ChevronDown size={16} /></button>
      </div>
      <div className="tab-row"><button className="active-tab" type="button">Overview</button><button type="button">Demographics</button><button type="button">Infrastructure</button></div>
      <div className="intro-card"><div className="intro-icon"><MapPinned size={19} /></div><div><strong>Explore the city spatially</strong><p>Pan and zoom the map to explore Kolkata. Verified ward data is coming next.</p></div></div>
      <div className="stats-title">DATA SNAPSHOT <span>IN PREPARATION</span></div>
      <div className="stat-placeholder"><div className="stat-glyph"><Layers3 size={17} /></div><div><b>Ward statistics</b><small>Will appear when data is connected</small></div></div>
      <div className="stat-placeholder"><div className="stat-glyph blue"><Trees size={17} /></div><div><b>Public facilities</b><small>Facility data planned for a later step</small></div></div>
      <div className="insight-card"><span className="insight-mark">✦</span><div><b>Built for spatial insight</b><p>Demographics, infrastructure, and accessibility will be introduced step by step.</p></div></div>
      <div className="panel-footer"><Shield size={14} /> Data sources and methods will be documented</div>
    </aside>
  )
}
