import { MapPinned } from 'lucide-react'
import { formatIndicatorValue, indicators } from '../utils/socioEconomicIndicators.js'

const details = [
  ['Total_Popu', 'Total population', 0],
  ['Male_Popul', 'Male population', 0],
  ['Female_Pop', 'Female population', 0],
  ['Total_Lite', 'Literate population', 0],
  ['Female_Lit', 'Literate female population', 0],
  ['Main_Worke', 'Main workers', 0],
  ['Marginal_W', 'Marginal workers', 0],
  ['SC_Populat', 'SC population', 0],
  ['ST_Populat', 'ST population', 0],
]

function displayCount(value, decimals = 0) {
  if (value == null || value === '') return 'No data'
  const numeric = Number(value)
  return Number.isFinite(numeric)
    ? numeric.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : 'No data'
}

export default function WardDetailsPanel({ ward, indicatorId }) {
  const indicator = indicators.find((item) => item.id === indicatorId) ?? indicators[0]
  const wardNumber = ward?.ward_no ?? ward?.Ward_No_1
  const wardName = ward?.Ward_Name ?? ward?.Name

  return (
    <aside className="analytics-panel ward-details-panel">
      <div className="panel-heading right-heading"><div><span className="eyebrow">SOCIO-ECONOMIC</span><h2>Ward details</h2></div></div>
      {ward ? <>
        <div className="ward-selected-card"><div className="intro-icon"><MapPinned size={19} /></div><div><strong>{wardName || `Ward ${wardNumber ?? ''}`}</strong><p>{wardNumber != null ? `Ward ${wardNumber}` : 'Kolkata Municipal Corporation'}</p></div></div>
        <div className="selected-indicator-card"><span className="eyebrow">SELECTED INDICATOR</span><strong>{indicator.label}</strong><b>{formatIndicatorValue(ward[indicator.field], indicator)}</b></div>
        <div className="section-label with-line">THEMATIC INDICATORS</div>
        <div className="ward-attribute-list">{indicators.map((item) => (
          <div className="ward-attribute" key={item.id}><span>{item.label}</span><strong>{formatIndicatorValue(ward[item.field], item)}</strong></div>
        ))}</div>
        <div className="section-label with-line">CENSUS COUNTS</div>
        <div className="ward-attribute-list">{details.map(([field, label, decimals]) => {
          return <div className="ward-attribute" key={field}><span>{label}</span><strong>{displayCount(ward[field], decimals)}</strong></div>
        })}</div>
      </> : <div className="ward-empty-state"><div className="intro-icon"><MapPinned size={19} /></div><strong>Select a ward on the map</strong><p>Its value for {indicator.label.toLowerCase()} and the available census attributes will appear here.</p></div>}
      <div className="panel-footer">Values are from the supplied ward boundary dataset; confirm source year and definitions before publication.</div>
    </aside>
  )
}
