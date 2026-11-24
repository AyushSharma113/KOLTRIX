import { useEffect, useState } from 'react'

export default function useRoadGeoJson(enabled = true) {
  const [state, setState] = useState({ data: null, error: '' })

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    fetch(`${import.meta.env.BASE_URL}data/roads.geojson`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Road GeoJSON request failed (${response.status})`)
        return response.json()
      })
      .then((data) => setState({ data, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error: error.message })
      })
    return () => controller.abort()
  }, [enabled])

  return state
}
