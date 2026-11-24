import { colorChoices, getRoadClasses, roadClassLabel } from '../utils/roadNetwork.js'

export default function NetworkAnalysisPanel({ data, roadClass, onRoadClassChange, roadColor, onRoadColorChange }) {
  const classes = data ? getRoadClasses(data) : []
  const visibleCount = data
    ? roadClass === 'all'
      ? data.features.length
      : data.features.filter(({ properties }) => (properties?.highway || 'unclassified') === roadClass).length
    : 0

  return (
    <aside className="layers-panel socio-panel network-panel">
      <div className="panel-heading"><div><span className="eyebrow">NETWORK ANALYSIS</span><h2>Road network</h2></div></div>
      <div className="section-label">ROAD CLASS</div>
      <select className="thematic-select" aria-label="Filter road class" value={roadClass} onChange={(event) => onRoadClassChange(event.target.value)}>
        <option value="all">All road classes</option>
        {classes.map((roadType) => <option key={roadType} value={roadType}>{roadClassLabel(roadType)}</option>)}
      </select>
      <p className="thematic-unit">{data ? `${visibleCount.toLocaleString()} of ${data.features.length.toLocaleString()} road features shown` : 'Loading road data…'}</p>

      <div className="section-label with-line">ROAD COLOUR</div>
      <select className="thematic-select" aria-label="Choose road colour" value={roadColor} onChange={(event) => onRoadColorChange(event.target.value)}>
        {Object.entries(colorChoices).map(([id, choice]) => <option key={id} value={id}>{choice.label}</option>)}
      </select>
      <div className="road-color-preview"><span style={{ backgroundColor: colorChoices[roadColor]?.color ?? colorChoices.lime.color }} /></div>

      <div className="section-label with-line">LEAST-COST ANALYSIS</div>
      <div className="layer-note"><span className="note-dot" /><p>The road layer is ready for route analysis. Least-cost routes need an origin, a destination, and a defined travel cost such as distance or travel time.</p></div>
      {classes.length > 0 && <div className="road-class-count">Road-class filters use the source OSM <code>highway</code> values.</div>}
    </aside>
  )
}
