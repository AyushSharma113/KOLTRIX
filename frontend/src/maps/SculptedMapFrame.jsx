import { useEffect, useId, useMemo, useRef, useState } from 'react'

function buildRoundedPolygonPath(points, defaultRadius = 20) {
  const corners = points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length]
    const next = points[(index + 1) % points.length]
    const inX = previous.x - point.x
    const inY = previous.y - point.y
    const outX = next.x - point.x
    const outY = next.y - point.y
    const inLength = Math.hypot(inX, inY)
    const outLength = Math.hypot(outX, outY)
    const radius = Math.min(point.r ?? defaultRadius, inLength * 0.44, outLength * 0.44)
    return {
      sx: point.x + inX / inLength * radius,
      sy: point.y + inY / inLength * radius,
      ex: point.x + outX / outLength * radius,
      ey: point.y + outY / outLength * radius,
      x: point.x,
      y: point.y,
    }
  })

  let path = `M ${corners[0].sx.toFixed(2)},${corners[0].sy.toFixed(2)}`
  corners.forEach((corner, index) => {
    path += ` Q ${corner.x},${corner.y} ${corner.ex.toFixed(2)},${corner.ey.toFixed(2)}`
    const next = corners[(index + 1) % corners.length]
    path += ` L ${next.sx.toFixed(2)},${next.sy.toFixed(2)}`
  })
  return `${path} Z`
}

export default function SculptedMapFrame({ children, className = '' }) {
  const containerRef = useRef(null)
  const id = useId().replaceAll(':', '')
  const clipId = `koltrix-frame-clip-${id}`
  const bezelId = `koltrix-frame-bezel-${id}`
  const specularId = `koltrix-frame-specular-${id}`
  const shadowId = `koltrix-frame-shadow-${id}`
  const [size, setSize] = useState({ width: 960, height: 640 })

  useEffect(() => {
    const element = containerRef.current
    if (!element) return undefined
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setSize({ width, height })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const framePath = useMemo(() => {
    const { width: w, height: h } = size
    const shoulder = Math.min(200, w * 0.18)
    const leftEar = Math.min(182, w * 0.175)
    const rightEar = Math.min(94, w * 0.095)
    return buildRoundedPolygonPath([
      { x: 1.5, y: 1.5, r: 25 },
      { x: shoulder, y: 1.5, r: 20 },
      { x: shoulder + 28, y: 28, r: 20 },
      { x: w - shoulder - 28, y: 28, r: 20 },
      { x: w - shoulder, y: 1.5, r: 20 },
      { x: w - 1.5, y: 1.5, r: 25 },
      { x: w - 1.5, y: h - 1.5, r: 25 },
      { x: w - rightEar, y: h - 1.5, r: 20 },
      { x: w - rightEar - 28, y: h - 26, r: 20 },
      { x: leftEar + 28, y: h - 26, r: 20 },
      { x: leftEar, y: h - 1.5, r: 20 },
      { x: 1.5, y: h - 1.5, r: 25 },
    ])
  }, [size])

  return (
    <div ref={containerRef} className={`sculpted-map-frame ${className}`}>
      <svg className="sculpted-frame-defs" aria-hidden="true" width="0" height="0">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse"><path d={framePath} /></clipPath>
        </defs>
      </svg>
      <div className="sculpted-map-clip" style={{ clipPath: `url(#${clipId})` }}>
        {children}
      </div>
      <svg className="sculpted-frame-border" viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={bezelId} x1="0%" y1="0%" x2="15%" y2="100%">
            <stop offset="0%" stopColor="#565d73" />
            <stop offset="16%" stopColor="#3e4456" />
            <stop offset="50%" stopColor="#272b37" />
            <stop offset="84%" stopColor="#1f232e" />
            <stop offset="100%" stopColor="#313646" />
          </linearGradient>
          <linearGradient id={specularId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".16" />
            <stop offset="10%" stopColor="#fff" stopOpacity=".03" />
            <stop offset="90%" stopColor="#fff" stopOpacity=".01" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity=".09" />
          </linearGradient>
          <filter id={shadowId} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="9.5" />
          </filter>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <path d={framePath} stroke="#040507" strokeWidth="22" strokeOpacity=".88" filter={`url(#${shadowId})`} />
          <path d={framePath} stroke="#06070a" strokeWidth="5" strokeOpacity=".72" />
          <path d={framePath} stroke={`url(#${specularId})`} strokeWidth="2.4" />
        </g>
        <path d={framePath} stroke="#050608" strokeWidth="3.2" />
        <path d={framePath} stroke={`url(#${bezelId})`} strokeWidth="1.35" />
      </svg>
    </div>
  )
}
