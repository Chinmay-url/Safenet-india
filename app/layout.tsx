import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  title: 'SafeNet India — AI Digital Public Safety',
  description: 'AI-powered platform to detect digital fraud, counterfeit currency, and scam networks in real time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void">
        <Navbar />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
      </body>
    </html>
  )
}
