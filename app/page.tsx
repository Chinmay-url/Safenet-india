'use client'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, Radio, MapPin } from 'lucide-react'
import StatsBanner from '@/components/StatsBanner'
import FraudShieldChat from '@/components/FraudShieldChat'
import { useEffect, useState } from 'react'

const incidents = [
  'Digital arrest attempt flagged · Pune',
  'Counterfeit ₹500 detected · Surat',
  'Mule account chain mapped · Hyderabad',
  'CBI impersonation blocked · Delhi NCR',
  'SIM swap fraud prevented · Mumbai',
  'WhatsApp phishing ring busted · Chennai',
]

function LiveTicker() {
  const [tickCount, setTickCount] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTickCount(c => c + 1), 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border-b border-border bg-accent/5 overflow-hidden">
      <div className="flex items-center gap-3 py-2 px-6 mono text-xs text-accent whitespace-nowrap animate-[marquee_22s_linear_infinite]">
        <Radio size={12} className="shrink-0" />
        {incidents.concat(incidents).map((t, i) => (
          <span key={i} className="flex items-center gap-3">
            {t} <span className="text-border">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const modules = [
  {
    href: '/scam-detector',
    icon: '📱',
    title: 'Digital Arrest Scam Detector',
    desc: 'Paste a call script, upload audio, or describe a suspicious call. Our AI classifies it against 47 known scam patterns, identifies CBI/ED impersonation signals, and generates an MHA-ready alert.',
    tag: 'LLM + Pattern Matching',
    color: 'accent',
  },
  {
    href: '/currency-scanner',
    icon: '💵',
    title: 'Counterfeit Currency Scanner',
    desc: 'Upload front + back photos of any denomination. Gemini Vision analyses microprint, security thread placement, and serial number patterns — delivering a verdict in under 3 seconds.',
    tag: 'Computer Vision',
    color: 'warn',
  },
  {
    href: '/fraud-network',
    icon: '🕸️',
    title: 'Fraud Network Intelligence',
    desc: 'Describe connected fraud incidents and watch our AI construct a live network graph — mapping scammer nodes, money mule chains, and victim clusters across jurisdictions.',
    tag: 'Graph AI',
    color: 'safe',
  },
  {
    href: '/threat-map',
    icon: '🗺️',
    title: 'Geospatial Threat Map',
    desc: 'Visualise fraud hotspots across India in real-time. Geospatial crime pattern intelligence reveals emerging scam clusters, cross-state networks, and high-risk zones for proactive deployment.',
    tag: 'Geospatial Intelligence',
    color: 'accent',
  },
]

const colorMap: Record<string, string> = {
  accent: 'text-accent border-accent/30 bg-accent/5',
  warn: 'text-warn border-warn/30 bg-warn/5',
  safe: 'text-safe border-safe/30 bg-safe/5',
}

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 grid-bg overflow-hidden">
        <LiveTicker />
        <div className="scan-line absolute inset-0 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto pt-12">
          <div className="inline-flex items-center gap-2 border border-accent/30 bg-accent/5 text-accent text-xs mono px-4 py-2 rounded-full mb-8">
            <AlertTriangle size={12} />
            CERT-In: 1.59M cybersecurity incidents in 2023 — and rising
          </div>

          <h1 className="text-5xl md:text-[5.5rem] font-display font-bold text-bright leading-[0.95] tracking-tight mb-6">
            India&apos;s Digital Safety
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-accent">Intelligence Layer</span>
              <span className="absolute inset-x-0 bottom-2 h-3 bg-accent/10 -z-0" />
            </span>
          </h1>

          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time AI detection for digital arrest scams, counterfeit currency,
            and organised fraud networks — built for law enforcement, banks, and citizens.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scam-detector"
              className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 hover:scale-[1.02] transition-all"
            >
              Try Scam Detector <ArrowRight size={16} />
            </Link>
            <Link
              href="/currency-scanner"
              className="flex items-center gap-2 border border-border text-bright px-6 py-3 rounded-lg font-semibold hover:border-accent/40 hover:bg-panel transition-all"
            >
              Scan Currency
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 mono text-muted text-xs">
          scroll to explore
        </div>
      </section>

      <StatsBanner />

      {/* Modules */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mono text-accent text-sm mb-3">FOUR MODULES. ONE PLATFORM.</p>
          <h2 className="text-4xl font-display font-bold text-bright">
            From signal to intelligence in seconds
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map(({ href, icon, title, desc, tag, color }) => (
            <Link
              key={href}
              href={href}
              className="group relative border border-border bg-panel rounded-xl p-6 hover:border-accent/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
            >
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 text-lg ${colorMap[color]}`}>
                {icon}
              </div>
              <div className="mono text-xs text-muted mb-3">{tag}</div>
              <h3 className="text-bright font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 text-accent text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                Open module <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Multi-Channel Shield Section */}
      <section className="border-y border-border bg-panel/40 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="mono text-safe text-sm mb-3">CITIZEN FRAUD SHIELD</p>
            <h2 className="text-3xl font-display font-bold text-bright mb-4">
              Multi-channel fraud protection
            </h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              Access SafeNet AI across WhatsApp, SMS, IVR, and web. Forward suspicious messages for instant AI analysis — no app download required.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '💬', label: 'WhatsApp', desc: 'Forward messages to +91-XXXXXXXX for instant scan', status: 'Active' },
              { icon: '📞', label: 'IVR Helpline', desc: 'Call 1800-XXX-XXXX for voice-guided scam check', status: 'Active' },
              { icon: '🌐', label: 'Web Portal', desc: 'Full AI analysis suite with evidence export', status: 'Active' },
              { icon: '📱', label: 'SMS Gateway', desc: 'Text suspicious content to 56161 for quick check', status: 'Beta' },
            ].map(ch => (
              <div key={ch.label} className="border border-border bg-void rounded-xl p-5 text-center">
                <div className="text-2xl mb-3">{ch.icon}</div>
                <p className="text-bright font-semibold text-sm mb-1">{ch.label}</p>
                <p className="text-muted text-xs mb-3">{ch.desc}</p>
                <span className={`mono text-[10px] px-2 py-0.5 rounded-full ${
                  ch.status === 'Active' ? 'text-safe bg-safe/10 border border-safe/30' : 'text-warn bg-warn/10 border border-warn/30'
                }`}>
                  {ch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted text-sm mono">
        SafeNet India · Built for ET AI Hackathon 2026 · Problem Statement #6
      </footer>

      <FraudShieldChat />
    </div>
  )
}
