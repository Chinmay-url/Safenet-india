import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a fraud network intelligence AI for Indian law enforcement. Analyse the incident description and extract a network graph plus intelligence summary.

Return ONLY valid JSON (no markdown, no preamble):
{
  "graph": {
    "nodes": [
      { "id": "short label", "type": "scammer" | "mule" | "victim" | "hub", "risk": number 0-100 }
    ],
    "links": [
      { "source": "node id", "target": "node id", "value": number 1-5 }
    ]
  },
  "summary": "2-3 sentence intelligence summary",
  "keyFindings": ["3-5 key findings for law enforcement"],
  "jurisdictions": ["list of cities/states/countries involved"],
  "totalVictims": number,
  "estimatedLoss": "formatted string like ₹45L or ₹2.3Cr",
  "detectionLeadTime": "string describing how early this network was detected before estimated mass victimisation, e.g. '14 hours before estimated payout window' or 'Active session — payout not yet initiated' or 'Detected after 3rd victim — 2 more at imminent risk'"
}

Node naming: use short labels like "Scammer-1", "Mule-A", "Victim-Pune", "Hub-Cambodia".
Create realistic network structures based on the description. Minimum 5 nodes, maximum 15.
Links represent money flow or communication connections.
detectionLeadTime: estimate how much earlier this detection is compared to when the scam would have completed its full cycle. Be specific with time estimates.`

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
        contents: [{ parts: [{ text: `Map this fraud network:\n\n${text}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
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
        { role: 'user', content: `Map this fraud network:\n\n${text}` },
      ],
      temperature: 0.2,
      max_tokens: 2048,
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

    try {
      const geminiResult = await callGemini(text)
      if (geminiResult) return NextResponse.json(geminiResult)
    } catch {}

    try {
      const groqResult = await callGroq(text)
      if (groqResult) return NextResponse.json(groqResult)
    } catch {}

    return NextResponse.json({ error: 'No API key configured. Add GEMINI_API_KEY or GROQ_API_KEY to .env.local' }, { status: 500 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
