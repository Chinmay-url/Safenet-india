'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Phone, Banknote, Network, Map } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { href: '/', label: 'Home', icon: Shield },
  { href: '/scam-detector', label: 'Scam Detector', icon: Phone },
  { href: '/currency-scanner', label: 'Currency Scanner', icon: Banknote },
  { href: '/fraud-network', label: 'Fraud Network', icon: Network },
  { href: '/threat-map', label: 'Threat Map', icon: Map },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-void/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-display font-700 text-bright text-lg tracking-tight">
            SafeNet<span className="text-accent">India</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.slice(1).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                path === href
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'text-muted hover:text-bright hover:bg-panel'
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
