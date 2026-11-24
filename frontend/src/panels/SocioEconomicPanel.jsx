import { colorRamps, formatIndicatorValue, indicators } from '../utils/socioEconomicIndicators.js'

export default function SocioEconomicPanel({ indicatorId, onIndicatorChange, rampId, onRampChange, breaks }) {
  const indicator = indicators.find((item) => item.id === indicatorId) ?? indicators[0]
  const ramp = colorRamps[rampId] ?? colorRamps.red

  return (
    <aside className="layers-panel socio-panel">
      <div className="panel-heading"><div><span className="eyebrow">CITY EXPLORER</span><h2>Socio-economic factors</h2></div></div>
      <div className="section-label">INDICATOR</div>
      <select className="thematic-select" aria-label="Choose socio-economic indicator" value={indicator.id} onChange={(event) => onIndicatorChange(event.target.value)}>
        {indicators.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <p className="thematic-unit">{indicator.unit}</p>

      <div className="section-label with-line">COLOUR RAMP</div>
      <select className="thematic-select" aria-label="Choose map colour" value={rampId} onChange={(event) => onRampChange(event.target.value)}>
        {Object.entries(colorRamps).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
      </select>
      <div className="ramp-preview" aria-label={`${ramp.label} colour ramp`}>
        {ramp.colors.map((color) => <span key={color} style={{ backgroundColor: color }} />)}
      </div>

      <div className="section-label with-line">WARD VALUE RANGES</div>
      <div className="thematic-legend">
        {ramp.colors.map((color, index) => {
          const lower = index === 0 ? null : breaks[index - 1]
          const upper = breaks[index]
          const range = breaks.length
            ? `${lower == null ? '≤' : `${formatIndicatorValue(lower, indicator)} –`} ${formatIndicatorValue(upper, indicator)}`
            : 'Loading values…'
          return <div className="thematic-legend-row" key={`${color}-${index}`}><span style={{ backgroundColor: color }} />{range}</div>
        })}
        <div className="thematic-legend-row"><span className="no-data-swatch" />No data</div>
      </div>
      <div className="layer-note"><span className="note-dot" /><p>Ward boundaries are shaded by the selected indicator. Click a ward to inspect its values.</p></div>
    </aside>
  )
}
