export const indicators = [
  { id: 'populationDensity', label: 'Population density', field: 'Pop_den', unit: 'people/km²', decimals: 0 },
  { id: 'sexRatio', label: 'Sex ratio', field: 'Sex_Ratio_', unit: 'females per 1,000 males', decimals: 1 },
  { id: 'literacy', label: 'Literate population', field: 'Literate_P', unit: '% of total population', decimals: 1 },
  { id: 'femaleLiteracyShare', label: 'Literate female population', field: 'Female_L_1', unit: '% of total population', decimals: 1 },
  { id: 'mainWorkers', label: 'Main workers', field: 'Main_Wor_1', unit: '% of total population', decimals: 1 },
  { id: 'marginalWorkers', label: 'Marginal workers', field: 'Marginal_1', unit: '% of total population', decimals: 1 },
  { id: 'scPopulation', label: 'SC population', field: 'SC_Popul_1', unit: '% of total population', decimals: 1 },
  { id: 'stPopulation', label: 'ST population', field: 'ST_Popul_1', unit: '% of total population', decimals: 1 },
]

export const colorRamps = {
  red: { label: 'Red', colors: ['#fff5f0', '#fcbba1', '#fc9272', '#ef3b2c', '#99000d'] },
  blue: { label: 'Blue', colors: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b'] },
  green: { label: 'Green', colors: ['#f7fcf5', '#c7e9c0', '#74c476', '#238b45', '#005a32'] },
  purple: { label: 'Purple', colors: ['#fcfbfd', '#dadaeb', '#9e9ac8', '#756bb1', '#3f007d'] },
}

export function getQuantileBreaks(features, field, classCount = 5) {
  const values = features
    .map(({ properties }) => properties?.[field])
    .filter((value) => value != null && value !== '' && Number.isFinite(Number(value)))
    .map(Number)
    .sort((a, b) => a - b)

  if (!values.length) return []
  return Array.from({ length: classCount }, (_, index) => {
    const quantile = (index + 1) / classCount
    const position = (values.length - 1) * quantile
    const lower = Math.floor(position)
    const upper = Math.ceil(position)
    return values[lower] + (values[upper] - values[lower]) * (position - lower)
  })
}

export function colorForValue(value, breaks, colors) {
  if (value == null || value === '') return '#6b7280'
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || !breaks.length) return '#6b7280'
  const index = breaks.findIndex((upperBound) => numericValue <= upperBound)
  return colors[Math.max(0, index === -1 ? colors.length - 1 : index)]
}

export function formatIndicatorValue(value, indicator) {
  if (value == null || value === '') return 'No data'
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return 'No data'
  const formatted = numericValue.toLocaleString(undefined, {
    minimumFractionDigits: indicator.decimals,
    maximumFractionDigits: indicator.decimals,
  })
  if (indicator.unit === '%') return `${formatted}%`
  if (indicator.unit.startsWith('%')) return `${formatted}${indicator.unit}`
  return `${formatted} ${indicator.unit}`
}
