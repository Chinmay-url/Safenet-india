'use client'

interface HotspotPoint {
  city: string
  lat: number
  lng: number
  intensity: number
  type: 'scam' | 'counterfeit' | 'fraud'
  count: number
}

const BOUNDS = { minLat: 8, maxLat: 35, minLng: 68, maxLng: 97 }

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * w
  const y = h - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * h
  return { x, y }
}

const typeColor = { scam: '#FF3B3B', counterfeit: '#FFB800', fraud: '#00D68F' }

export default function CrimeHeatmap({ points }: { points: HotspotPoint[] }) {
  const w = 600, h = 520

  return (
    <div className="relative border border-border bg-panel rounded-xl overflow-hidden" style={{ height: 480 }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        {/* Grid background */}
        <defs>
          <pattern id="heatGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#2A2A3A" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          {points.map((p, i) => (
            <radialGradient key={i} id={`heatGlow-${i}`}>
              <stop offset="0%" stopColor={typeColor[p.type]} stopOpacity={p.intensity * 0.5} />
              <stop offset="60%" stopColor={typeColor[p.type]} stopOpacity={p.intensity * 0.15} />
              <stop offset="100%" stopColor={typeColor[p.type]} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        <rect width={w} height={h} fill="url(#heatGrid)" />

        {/* India outline hint — simplified convex boundary */}
        <path
          d="M 180,20 L 280,15 L 340,40 L 380,80 L 400,140 L 410,200 L 390,260 L 370,300 L 340,350 L 310,400 L 280,430 L 250,450 L 230,460 L 210,440 L 200,400 L 190,360 L 170,320 L 150,280 L 140,240 L 130,200 L 120,160 L 130,120 L 150,60 Z"
          fill="none"
          stroke="#2A2A3A"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Hotspots */}
        {points.map((p, i) => {
          const { x, y } = project(p.lat, p.lng, w, h)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={50 * p.intensity + 20} fill={`url(#heatGlow-${i})`} />
              <circle cx={x} cy={y} r={5} fill={typeColor[p.type]} stroke="#0A0A0F" strokeWidth={2} />
              <text x={x} y={y - 14} fontSize={11} fill="#F0F0FF" textAnchor="middle" fontWeight="600">
                {p.city}
              </text>
              <text x={x} y={y + 20} fontSize={9} fill="#6B6B80" textAnchor="middle" className="mono">
                {p.count} incidents
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 mono text-xs">
        {Object.entries(typeColor).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-muted capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4">
        <p className="mono text-xs text-bright font-semibold">NATIONAL THREAT MAP</p>
        <p className="mono text-[10px] text-muted">Real-time incident heatmap</p>
      </div>
    </div>
  )
}
