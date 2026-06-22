import clsx from 'clsx'

type Level = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE'

const config: Record<Level, { color: string; bg: string; border: string; ring: string }> = {
  CRITICAL: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/50', ring: '#FF3B3B' },
  HIGH:     { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/50', ring: '#FB923C' },
  MEDIUM:   { color: 'text-warn', bg: 'bg-warn/10', border: 'border-warn/50', ring: '#FFB800' },
  LOW:      { color: 'text-yellow-300', bg: 'bg-yellow-300/10', border: 'border-yellow-300/30', ring: '#FDE047' },
  SAFE:     { color: 'text-safe', bg: 'bg-safe/10', border: 'border-safe/50', ring: '#00D68F' },
}

export function RiskBadge({ level }: { level: Level }) {
  const c = config[level]
  return (
    <span className={clsx(
      'mono text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1.5',
      c.color, c.bg, c.border,
      (level === 'CRITICAL' || level === 'HIGH') && 'threat-pulse'
    )}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.ring }} />
      {level}
    </span>
  )
}

export function ConfidenceGauge({ value, level, size = 64 }: { value: number; level: Level; size?: number }) {
  const c = config[level]
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#2A2A3A" strokeWidth="4" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={c.ring} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <span className="absolute mono text-xs font-bold text-bright">{value}%</span>
    </div>
  )
}

export default RiskBadge
