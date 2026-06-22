import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are SafeNet India's Digital Arrest Scam Detection AI, trained on MHA cybercrime data and CERT-In advisories.

Analyse the provided text and return ONLY valid JSON (no markdown, no preamble) in this exact structure:
{
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  "scamType": "string describing the scam type",
  "confidence": number (0-100),
  "impersonatedAgency": "string or empty",
  "indicators": ["array of 3-5 scam pattern indicators detected"],
  "redFlags": ["array of 3-6 specific red flags in this text"],
  "recommendation": "what the recipient should do",
  "mhaAlert": "draft MHA-format alert text if CRITICAL or HIGH, else empty string"
}

Known digital arrest scam patterns: CBI/ED/TRAI/Customs impersonation, 'digital arrest' threats, video call hostage, Aadhaar-linked crime accusations, immediate payment demands, secrecy instructions, fake warrant mentions.`

async function callGemini(text: string) {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') return null

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: `Analyse this text for scam patterns:\n\n${text}` }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
      }),
    }
  )
  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

async function callGroq(text: string) {
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey || groqKey === 'your_groq_api_key_here') return null

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyse this text for scam patterns:\n\n${text}` },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    }),
  })
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

    // Try Gemini first
    try {
      const geminiResult = await callGemini(text)
      if (geminiResult) return NextResponse.json(geminiResult)
    } catch {}

    // Fallback: Groq
    try {
      const groqResult = await callGroq(text)
      if (groqResult) return NextResponse.json(groqResult)
    } catch {}

    return NextResponse.json({ error: 'No API key configured. Add GEMINI_API_KEY or GROQ_API_KEY to .env.local' }, { status: 500 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
