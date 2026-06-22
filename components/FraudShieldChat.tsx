'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Shield, AlertTriangle, Phone } from 'lucide-react'

interface Message {
  role: 'user' | 'bot'
  text: string
  timestamp: string
}

const BOT_RESPONSES: Record<string, { text: string; risk?: string }[]> = {
  scam: [
    { text: "This matches a known **digital arrest scam** pattern. The caller is impersonating a law enforcement agency. Do NOT share any personal information or make any payments.", risk: 'CRITICAL' },
    { text: "I've identified 3 red flags: urgency pressure, authority impersonation, and secrecy demands. This is a textbook scam. Block the number and report to cybercrime.gov.in.", risk: 'HIGH' },
  ],
  currency: [
    { text: "For counterfeit detection, upload a clear photo of both sides of the note. I'll check the security thread, watermark, microprint, and serial number patterns.", risk: undefined },
    { text: "Quick tips: Hold the note at an angle to check colour-shift ink. Feel for raised print on the RBI seal and Mahatma Gandhi portrait. Check the security thread reads 'RBI' and 'Bharat' in Hindi.", risk: undefined },
  ],
  general: [
    { text: "I can help you with: 🛡️ Scam detection — paste suspicious messages or describe calls 💵 Currency verification — upload note photos 🕸️ Fraud network mapping — describe connected incidents. What do you need?", risk: undefined },
    { text: "SafeNet India has helped detect over 1,200 scam attempts this month alone. Our AI cross-references 47 known fraud patterns against your input in real-time.", risk: undefined },
  ],
  emergency: [
    { text: "If you're in immediate danger, call **112** (Emergency) or **1930** (Cyber Crime Helpline). For reporting online: cybercrime.gov.in. Do not engage further with the scammer.", risk: 'CRITICAL' },
  ],
}

function classifyInput(text: string): string {
  const lower = text.toLowerCase()
  if (/arrest|cbi|ed |police|warrant|urgent|pay now|digital arrest/.test(lower)) return 'scam'
  if (/currency|note|money|fake|counterfeit|₹|rupee|security thread/.test(lower)) return 'currency'
  if (/emergency|help|scared|they called|what do i do|already sent/.test(lower)) return 'emergency'
  return 'general'
}

function getResponse(input: string): { text: string; risk?: string } {
  const category = classifyInput(input)
  const responses = BOT_RESPONSES[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

export default function FraudShieldChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hello! I'm SafeNet Shield — your AI fraud protection assistant. Forward suspicious messages, describe scam calls, or ask about currency verification. How can I help?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', text: input, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(input)
      const botMsg: Message = { role: 'bot', text: response.text, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 1200)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 w-[360px] border border-border bg-void rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-panel border-b border-border px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <Shield size={14} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-bright text-sm font-semibold">SafeNet Shield</p>
              <p className="text-safe text-[10px] mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-safe inline-block" />
                AI Fraud Protection · Online
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-bright text-xs mono px-2 py-1 rounded hover:bg-panel transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={10} className="text-accent" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent text-white rounded-br-sm'
                    : 'bg-panel border border-border text-bright rounded-bl-sm'
                }`}>
                  {msg.text.split('**').map((part, j) =>
                    j % 2 === 1 ? <strong key={j} className="text-accent">{part}</strong> : <span key={j}>{part}</span>
                  )}
                  <div className={`text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-white/50' : 'text-muted'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-panel border border-border flex items-center justify-center shrink-0 mt-0.5">
                    <User size={10} className="text-muted" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                  <Bot size={10} className="text-accent" />
                </div>
                <div className="bg-panel border border-border rounded-xl rounded-bl-sm px-3 py-2.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="px-4 py-2 border-t border-border flex gap-1.5 overflow-x-auto">
            {[
              { label: '🚨 Scam help', input: 'I received a suspicious call claiming to be CBI' },
              { label: '💵 Check note', input: 'How do I check if a ₹500 note is fake?' },
              { label: '📞 Emergency', input: 'I already sent money to a scammer, help!' },
            ].map(q => (
              <button
                key={q.label}
                onClick={() => { setInput(q.input) }}
                className="mono text-[10px] text-muted hover:text-accent border border-border hover:border-accent/30 px-2 py-1 rounded-full whitespace-nowrap transition-all"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Describe a scam or ask a question..."
              className="flex-1 bg-panel border border-border rounded-lg px-3 py-2 text-bright text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent/90 disabled:opacity-40 transition-all shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen
            ? 'bg-panel border border-border text-muted hover:text-bright'
            : 'bg-accent text-white hover:bg-accent/90 hover:scale-105 shadow-accent/30'
        }`}
      >
        {isOpen ? (
          <span className="text-lg">✕</span>
        ) : (
          <div className="relative">
            <MessageCircle size={22} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-safe rounded-full border-2 border-void" />
          </div>
        )}
      </button>
    </div>
  )
}
