import { useEffect, useId, useMemo, useRef, useState } from 'react'

function roundedPolygonPath(points, radius = 18) {
  const len = points.length
  const corners = points.map((point, index) => {
    const previous = points[(index - 1 + len) % len]
    const next = points[(index + 1) % len]
    const inX = previous.x - point.x
    const inY = previous.y - point.y
    const outX = next.x - point.x
    const outY = next.y - point.y
    const inLength = Math.hypot(inX, inY)
    const outLength = Math.hypot(outX, outY)
    const r = Math.min(radius, inLength * 0.42, outLength * 0.42)
    return {
      startX: point.x + (inX / inLength) * r,
      startY: point.y + (inY / inLength) * r,
      controlX: point.x,
      controlY: point.y,
      endX: point.x + (outX / outLength) * r,
      endY: point.y + (outY / outLength) * r,
    }
  })

  let path = `M ${corners[0].startX} ${corners[0].startY}`
  corners.forEach((corner, index) => {
    path += ` Q ${corner.controlX} ${corner.controlY} ${corner.endX} ${corner.endY}`
    const next = corners[(index + 1) % len]
    path += ` L ${next.startX} ${next.startY}`
  })
  return `${path} Z`
}

export default function SculptedMapFrame({ children, className = '' }) {
  const containerRef = useRef(null)
  const uniqueId = useId().replaceAll(':', '')
  const clipId = `koltrix-map-clip-${uniqueId}`
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
    const { width, height } = size
    const topShoulder = Math.min(180, width * 0.17)
    const bottomLeftEar = Math.min(165, width * 0.17)
    const bottomRightEar = Math.min(84, width * 0.1)
    return roundedPolygonPath([
      { x: 1, y: 1 },
      { x: topShoulder, y: 1 },
      { x: topShoulder + 24, y: 24 },
      { x: width - topShoulder - 24, y: 24 },
      { x: width - topShoulder, y: 1 },
      { x: width - 1, y: 1 },
      { x: width - 1, y: height - 1 },
      { x: width - bottomRightEar, y: height - 1 },
      { x: width - bottomRightEar - 24, y: height - 26 },
      { x: bottomLeftEar + 24, y: height - 26 },
      { x: bottomLeftEar, y: height - 1 },
      { x: 1, y: height - 1 },
    ])
  }, [size])

  return (
    <div ref={containerRef} className={`sculpted-map-frame ${className}`}>
      <svg className="sculpted-frame-defs" aria-hidden="true" width="0" height="0">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={framePath} />
          </clipPath>
        </defs>
      </svg>
      <div className="sculpted-map-clip" style={{ clipPath: `url(#${clipId})` }}>
        {children}
      </div>
      <svg className="sculpted-frame-border" viewBox={`0 0 ${size.width} ${size.height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`${clipId}-edge`} x1="0" y1="0" x2={size.width} y2={size.height} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#777b8a" stopOpacity="0.72" />
            <stop offset="32%" stopColor="#424653" stopOpacity="0.82" />
            <stop offset="68%" stopColor="#292c38" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#626675" stopOpacity="0.66" />
          </linearGradient>
        </defs>
        <path className="sculpted-frame-halo" d={framePath} />
        <path className="sculpted-frame-edge" d={framePath} stroke={`url(#${clipId}-edge)`} />
      </svg>
    </div>
  )
}
