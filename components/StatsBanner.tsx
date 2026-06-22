import AnimatedCounter from './AnimatedCounter'

const stats = [
  { value: 1140000, display: '1.14M', label: 'Cybercrime complaints, 2023', delta: '+60% YoY', isText: true },
  { value: 1776, prefix: '₹', suffix: 'Cr', label: 'Lost to digital arrest scams', delta: 'Jan–Sep 2024' },
  { value: 60, suffix: '%', label: 'Rise in cybercrime', delta: 'vs 2022' },
  { value: 12, label: 'Regional languages covered', delta: 'by SafeNet AI' },
]

export default function StatsBanner() {
  return (
    <div className="border-y border-border bg-panel/40 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40">
        {stats.map((s) => (
          <div key={s.label} className="bg-void px-6 py-2 text-center md:text-left">
            <div className="text-3xl font-bold text-accent tabular-nums">
              {s.isText ? s.display : (
                <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} />
              )}
            </div>
            <div className="text-muted text-xs mt-1.5 leading-snug">{s.label}</div>
            <div className="text-warn text-[10px] mt-1 mono">{s.delta}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
