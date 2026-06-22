'use client'
import { useState } from 'react'
import { Network, Loader2, Send, RefreshCw, Clock, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import ErrorBoundary from '@/components/ErrorBoundary'
import { CardSkeleton } from '@/components/Skeletons'
import EvidenceExport from '@/components/EvidenceExport'

const NetworkGraph = dynamic(() => import('@/components/NetworkGraph'), { ssr: false })

const DEMO_INPUT = `Victim A in Pune received a WhatsApp call from +91-XXXXX claiming to be CBI.
Money transferred to account B. Account B then sent to account C and D (mules).
Same phone number contacted 5 other victims in Mumbai and Hyderabad.
Account C was linked to a VoIP provider in Cambodia.`

interface GraphData {
  nodes: { id: string; type: 'scammer' | 'mule' | 'victim' | 'hub'; risk: number }[]
  links: { source: string; target: string; value: number }[]
}

interface NetworkResult {
  graph: GraphData
  summary: string
  keyFindings: string[]
  jurisdictions: string[]
  totalVictims: number
  estimatedLoss: string
  detectionLeadTime?: string
}

export default function FraudNetworkPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NetworkResult | null>(null)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  async function analyse(attempt = 0) {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/fraud-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setRetryCount(0)
    } catch (e: any) {
      if (attempt < 2) {
        setRetryCount(attempt + 1)
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
        return analyse(attempt + 1)
      }
      setError(e.message || 'Analysis failed after retries.')
      setRetryCount(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="pt-24 min-h-screen px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-safe/10 border border-safe/30 rounded-lg flex items-center justify-center">
                <Network size={18} className="text-safe" />
              </div>
              <div>
                <p className="mono text-safe text-xs">MODULE 03</p>
                <h1 className="text-2xl font-display font-bold text-bright">Fraud Network Intelligence</h1>
              </div>
            </div>
            <p className="text-muted text-sm max-w-2xl">
              Describe multiple connected fraud incidents. Our AI maps scammer nodes, money mule chains,
              and victim clusters into an interactive graph for law enforcement intelligence packages.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Input */}
            <div className="lg:col-span-2 space-y-4">
              <div className="border border-border bg-panel rounded-xl p-5">
                <label className="mono text-xs text-muted mb-3 block">INCIDENT DESCRIPTION</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={8}
                  placeholder="Describe fraud incidents, accounts, phone numbers, connections..."
                  className="w-full bg-void border border-border rounded-lg p-3 text-bright text-sm placeholder:text-muted resize-none focus:outline-none focus:border-safe/40 transition-colors"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setText(DEMO_INPUT)}
                    className="mono text-xs text-muted hover:text-safe border border-border px-3 py-1.5 rounded-lg transition-all"
                  >
                    Load Example
                  </button>
                  <button
                    onClick={() => analyse()}
                    disabled={loading || !text.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-safe text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-safe/90 disabled:opacity-40 transition-all"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {loading ? `Mapping${retryCount > 0 ? ` (retry ${retryCount})` : ''}...` : 'Map Network'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-accent/30 bg-accent/5 rounded-xl p-4 text-accent text-sm flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => analyse()} className="text-accent hover:underline flex items-center gap-1 text-xs">
                    <RefreshCw size={12} /> Retry
                  </button>
                </div>
              )}

              {loading && <CardSkeleton />}

              {result && !loading && (
                <div className="border border-border bg-panel rounded-xl p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="mono text-xl font-bold text-accent">{result.totalVictims}</div>
                      <div className="text-muted text-xs">Victims</div>
                    </div>
                    <div className="text-center">
                      <div className="mono text-xl font-bold text-warn">{result.jurisdictions.length}</div>
                      <div className="text-muted text-xs">Jurisdictions</div>
                    </div>
                    <div className="text-center">
                      <div className="mono text-xl font-bold text-safe">{result.estimatedLoss}</div>
                      <div className="text-muted text-xs">Est. Loss</div>
                    </div>
                  </div>

                  {/* Detection Lead Time */}
                  {result.detectionLeadTime && (
                    <div className="border border-accent/20 bg-accent/5 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-accent" />
                      </div>
                      <div>
                        <p className="mono text-[10px] text-muted">DETECTION LEAD TIME</p>
                        <p className="text-bright text-sm font-semibold">{result.detectionLeadTime}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="mono text-xs text-muted mb-2">KEY FINDINGS</p>
                    <ul className="space-y-1.5">
                      {result.keyFindings.map((f, i) => (
                        <li key={i} className="text-sm text-bright flex items-start gap-2">
                          <span className="text-safe mt-0.5 shrink-0">→</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mono text-xs text-muted mb-2">JURISDICTIONS</p>
                    <div className="flex flex-wrap gap-2">
                      {result.jurisdictions.map((j) => (
                        <span key={j} className="mono text-xs border border-border text-muted px-2 py-1 rounded flex items-center gap-1">
                          <MapPin size={10} /> {j}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mono text-xs text-muted mb-2">NODE LEGEND</p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { color: 'bg-accent', label: 'Scammer' },
                        { color: 'bg-orange-500', label: 'Hub' },
                        { color: 'bg-warn', label: 'Money Mule' },
                        { color: 'bg-muted', label: 'Victim' },
                      ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-muted text-xs">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Export */}
                  <EvidenceExport caseData={result} />
                </div>
              )}
            </div>

            {/* Graph */}
            <div className="lg:col-span-3 border border-border bg-panel rounded-xl overflow-hidden" style={{ minHeight: '500px' }}>
              {result ? (
                <NetworkGraph data={result.graph} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8" style={{ minHeight: '500px' }}>
                  <Network size={48} className="text-border" />
                  <div>
                    <p className="text-muted">Network graph will appear here</p>
                    <p className="text-border text-sm mt-1">Nodes are interactive — drag to explore</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
