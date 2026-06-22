import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are an RBI-standard counterfeit currency detection AI. Analyse the provided Indian currency note image(s).

If multiple images are provided (front + back), compare security features across both sides for a comprehensive analysis.

Return ONLY valid JSON (no markdown, no preamble):
{
  "verdict": "GENUINE" | "COUNTERFEIT" | "SUSPICIOUS",
  "confidence": number (0-100),
  "denomination": "₹500 / ₹200 / ₹100 / ₹50 / ₹20 / ₹10 / Unknown",
  "checks": [
    { "name": "Security Thread", "passed": boolean, "detail": "specific observation" },
    { "name": "Microprint Quality", "passed": boolean, "detail": "specific observation" },
    { "name": "Intaglio Printing", "passed": boolean, "detail": "specific observation" },
    { "name": "Watermark", "passed": boolean, "detail": "specific observation" },
    { "name": "Serial Number Pattern", "passed": boolean, "detail": "specific observation" },
    { "name": "Colour Shift Ink", "passed": boolean, "detail": "specific observation" },
    { "name": "Security Thread Continuity", "passed": boolean, "detail": "thread alignment between front and back" },
    { "name": "Latent Image", "passed": boolean, "detail": "latent image visibility and correctness" }
  ],
  "summary": "2-3 sentence analysis summary",
  "action": "What the bank teller or field officer should do next"
}

Be specific about what you observe in the image. If the image is unclear, note that in the detail fields.`

async function callGemini(parts: any[]) {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') return null

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
      }),
    }
  )
  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

async function callGroq(prompt: string) {
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey || groqKey === 'your_groq_api_key_here') return null

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
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
    const body = await req.json()
    const { images, imageBase64, mimeType, single } = body

    // Legacy single-image support
    if (single !== false && imageBase64) {
      const parts = [
        { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } },
        { text: 'Analyse this Indian currency note for authenticity. Check all security features visible in the image.' }
      ]
      try {
        const result = await callGemini(parts)
        if (result) return NextResponse.json(result)
      } catch {}

      const fallback = await callGroq(`Analyse this Indian currency note image (base64 provided separately) for authenticity.`)
      if (fallback) return NextResponse.json(fallback)

      return NextResponse.json({ error: 'Gemini API key required for vision analysis. Add GEMINI_API_KEY to .env.local' }, { status: 500 })
    }

    // Multi-image support
    if (images && Array.isArray(images) && images.length > 0) {
      const parts: any[] = []
      for (const img of images) {
        parts.push({
          inline_data: { mime_type: img.mimeType || 'image/jpeg', data: img.imageBase64 }
        })
      }

      const imageLabels = images.map((img: any) => img.label || 'image').join(' and ')
      parts.push({
        text: `Analyse these Indian currency note images (${imageLabels}) for authenticity. Compare security features across all provided images. Check security thread continuity, latent image, and all other features.`
      })

      try {
        const result = await callGemini(parts)
        if (result) return NextResponse.json(result)
      } catch {}

      return NextResponse.json({ error: 'Analysis failed. Ensure GEMINI_API_KEY is configured.' }, { status: 500 })
    }

    return NextResponse.json({ error: 'No image(s) provided' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
