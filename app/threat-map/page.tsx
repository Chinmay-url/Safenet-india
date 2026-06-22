'use client'
import { Map, TrendingUp, AlertTriangle, Shield } from 'lucide-react'
import CrimeHeatmap from '@/components/CrimeHeatmap'
import ErrorBoundary from '@/components/ErrorBoundary'

const HOTSPOTS = [
  { city: 'Delhi NCR', lat: 28.61, lng: 77.23, intensity: 0.95, type: 'scam' as const, count: 342 },
  { city: 'Mumbai', lat: 19.08, lng: 72.88, intensity: 0.88, type: 'fraud' as const, count: 287 },
  { city: 'Hyderabad', lat: 17.39, lng: 78.49, intensity: 0.78, type: 'scam' as const, count: 234 },
  { city: 'Pune', lat: 18.52, lng: 73.86, intensity: 0.72, type: 'scam' as const, count: 198 },
  { city: 'Surat', lat: 21.17, lng: 72.83, intensity: 0.82, type: 'counterfeit' as const, count: 256 },
  { city: 'Chennai', lat: 13.08, lng: 80.27, intensity: 0.65, type: 'fraud' as const, count: 176 },
  { city: 'Kolkata', lat: 22.57, lng: 88.36, intensity: 0.58, type: 'counterfeit' as const, count: 152 },
  { city: 'Bengaluru', lat: 12.97, lng: 77.59, intensity: 0.7, type: 'fraud' as const, count: 189 },
  { city: 'Ahmedabad', lat: 23.02, lng: 72.57, intensity: 0.55, type: 'counterfeit' as const, count: 134 },
  { city: 'Cambodia Hub', lat: 11.56, lng: 104.92, intensity: 0.9, type: 'scam' as const, count: 89 },
]

const stats = [
  { label: 'Active Scam Sources', value: '23', icon: AlertTriangle, color: 'text-accent' },
  { label: 'States Affected', value: '18', icon: Map, color: 'text-warn' },
  { label: 'Networks Mapped', value: '147', icon: TrendingUp, color: 'text-safe' },
  { label: 'Cross-Border Links', value: '12', icon: Shield, color: 'text-orange-400' },
]

const recentIncidents = [
  { time: '14:32', city: 'Pune', type: 'Digital arrest attempt', risk: 'CRITICAL', status: 'Blocked' },
  { time: '13:18', city: 'Surat', type: 'Counterfeit ₹2000 note seized', risk: 'HIGH', status: 'Flagged' },
  { time: '12:05', city: 'Delhi', type: 'Mule account chain (6 accounts)', risk: 'CRITICAL', status: 'Mapped' },
  { time: '11:47', city: 'Hyderabad', type: 'CBI impersonation call', risk: 'HIGH', status: 'Blocked' },
  { time: '10:22', city: 'Mumbai', type: 'WhatsApp phishing link campaign', risk: 'MEDIUM', status: 'Tracked' },
  { time: '09:55', city: 'Chennai', type: 'SIM swap fraud attempt', risk: 'HIGH', status: 'Prevented' },
]

const riskColor: Record<string, string> = {
  CRITICAL: 'text-accent bg-accent/10',
  HIGH: 'text-orange-400 bg-orange-400/10',
  MEDIUM: 'text-warn bg-warn/10',
}

export default function ThreatMapPage() {
  return (
    <ErrorBoundary>
      <div className="pt-24 min-h-screen px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center">
                <Map size={18} className="text-accent" />
              </div>
              <div>
                <p className="mono text-accent text-xs">MODULE 04</p>
                <h1 className="text-2xl font-display font-bold text-bright">Geospatial Threat Intelligence</h1>
              </div>
            </div>
            <p className="text-muted text-sm max-w-2xl">
              Real-time crime pattern visualisation across India. Geospatial intelligence reveals emerging scam clusters,
              cross-state fraud networks, and high-risk zones for proactive law enforcement deployment.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map(s => (
              <div key={s.label} className="border border-border bg-panel rounded-xl p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-void flex items-center justify-center ${s.color}`}>
                  <s.icon size={16} />
                </div>
                <div>
                  <div className="mono text-lg font-bold text-bright">{s.value}</div>
                  <div className="text-muted text-[10px]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Heatmap */}
            <div className="lg:col-span-2">
              <CrimeHeatmap points={HOTSPOTS} />
            </div>

            {/* Incident Feed */}
            <div className="border border-border bg-panel rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="mono text-xs text-bright font-semibold">LIVE INCIDENT FEED</p>
                <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              </div>
              <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {recentIncidents.map((inc, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-void/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="mono text-[10px] text-muted">{inc.time}</span>
                      <span className={`mono text-[10px] px-1.5 py-0.5 rounded ${riskColor[inc.risk]}`}>
                        {inc.risk}
                      </span>
                    </div>
                    <p className="text-bright text-sm font-medium">{inc.type}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted text-xs">{inc.city}</span>
                      <span className="text-safe text-[10px] mono">{inc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border">
                <p className="text-muted text-[10px] text-center mono">Simulated data for demonstration</p>
              </div>
            </div>
          </div>

          {/* Coverage Banner */}
          <div className="mt-8 border border-border bg-panel/40 rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative">
              <p className="mono text-accent text-sm mb-2">MULTI-AGENCY INTELLIGENCE SHARING</p>
              <h3 className="text-xl font-display font-bold text-bright mb-2">
                Cross-jurisdiction handoff in real-time
              </h3>
              <p className="text-muted text-sm max-w-lg mx-auto">
                SafeNet maps fraud networks across state boundaries and connects with CBI, state cyber cells,
                RBI, and telecom operators for coordinated takedown operations.
              </p>
              <div className="flex justify-center gap-4 mt-4 mono text-xs text-muted">
                <span className="border border-border px-3 py-1 rounded-full">CBI Integration</span>
                <span className="border border-border px-3 py-1 rounded-full">RBI FICN Module</span>
                <span className="border border-border px-3 py-1 rounded-full">MHA CERT-In</span>
                <span className="border border-border px-3 py-1 rounded-full">State Cyber Cells</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
