export const colorChoices = {
  lime: { label: 'Lime', color: '#b4eb42' },
  cyan: { label: 'Cyan', color: '#44c5d8' },
  orange: { label: 'Orange', color: '#f0a45d' },
  violet: { label: 'Violet', color: '#a78bfa' },
}

export function getRoadClasses(data) {
  return [...new Set(data.features.map(({ properties }) => properties?.highway || 'unclassified'))]
    .sort((a, b) => a.localeCompare(b))
}

export function roadClassLabel(roadClass) {
  return roadClass.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function getRoadTag(tags, key) {
  if (typeof tags !== 'string') return ''
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = tags.match(new RegExp(`"${escapedKey}"=>"([^"]*)"`))
  return match?.[1] ?? ''
}
