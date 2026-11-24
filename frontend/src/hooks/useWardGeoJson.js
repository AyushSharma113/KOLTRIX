import { useEffect, useState } from 'react'

export default function useWardGeoJson() {
  const [state, setState] = useState({ data: null, error: '' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${import.meta.env.BASE_URL}data/wards.geojson`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Ward GeoJSON request failed (${response.status})`)
        return response.json()
      })
      .then((data) => setState({ data, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error: error.message })
      })
    return () => controller.abort()
  }, [])

  return state
}
