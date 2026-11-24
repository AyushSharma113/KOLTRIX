import { Route } from 'lucide-react'
import { getRoadTag } from '../utils/roadNetwork.js'

export default function RoadDetailsPanel({ road }) {
  const details = road ? [
    ['Road class', road.highway || 'Unclassified'],
    ['OSM feature ID', road.osm_id || 'Not available'],
    ['Road name', road.name || 'Unnamed road'],
    ['Speed limit', getRoadTag(road.other_tags, 'maxspeed') || 'Not recorded'],
    ['One-way', getRoadTag(road.other_tags, 'oneway') || 'Not recorded'],
    ['Surface', getRoadTag(road.other_tags, 'surface') || 'Not recorded'],
  ] : []

  return (
    <aside className="analytics-panel ward-details-panel">
      <div className="panel-heading right-heading"><div><span className="eyebrow">NETWORK ANALYSIS</span><h2>Road details</h2></div></div>
      {road ? <>
        <div className="ward-selected-card"><div className="intro-icon"><Route size={19} /></div><div><strong>{road.name || 'Unnamed road'}</strong><p>{road.highway || 'Unclassified road'}</p></div></div>
        <div className="section-label with-line">SOURCE ATTRIBUTES</div>
        <div className="ward-attribute-list">{details.map(([label, value]) => (
          <div className="ward-attribute" key={label}><span>{label}</span><strong>{value}</strong></div>
        ))}</div>
      </> : <div className="ward-empty-state"><div className="intro-icon"><Route size={19} /></div><strong>Select a road on the map</strong><p>Its OSM road class, name, speed limit, and direction tags will appear here when available.</p></div>}
      <div className="panel-footer">Route costs and restrictions will be stated explicitly when least-cost routing is added.</div>
    </aside>
  )
}
