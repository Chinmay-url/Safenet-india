# SafeNet India

**India's Digital Safety Intelligence Layer** — AI-powered platform to detect digital fraud, counterfeit currency, and scam networks in real time.

Built for **ET AI Hackathon 2026 · Problem Statement #6**

## Modules

### 1. Digital Arrest Scam Detector
Paste call transcripts or messages to detect 47+ known scam patterns including CBI/ED/TRAI impersonation, digital arrest threats, and Aadhaar-linked crime accusations. Generates cybercrime complaint drafts and MHA alerts.

### 2. Counterfeit Currency Scanner
Upload images of Indian currency notes for AI-powered security feature analysis — security thread, microprint, intaglio printing, watermark, serial number, colour-shift ink, and more.

### 3. Fraud Network Intelligence
Describe connected fraud incidents to generate interactive D3 network graphs mapping scammer nodes, money mule chains, and victim clusters with evidence export for law enforcement.

### 4. Geospatial Threat Map
Visualizes fraud hotspots across India with an interactive crime heatmap, live incident feed, and aggregate threat statistics.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** React 18, Tailwind CSS
- **AI:** Google Gemini 1.5 Flash, Groq/Llama3-8B (fallback)
- **Visualizations:** D3.js
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- At least one AI API key (`GEMINI_API_KEY` or `GROQ_API_KEY`)

### Install

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:

```
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

## Project Structure

```
safenet-india/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── scam-detector/page.tsx      # Scam detector module
│   ├── currency-scanner/page.tsx   # Currency scanner module
│   ├── fraud-network/page.tsx      # Fraud network module
│   ├── threat-map/page.tsx         # Geospatial threat map
│   └── api/
│       ├── scam-detect/route.ts    # Scam detection API
│       ├── currency-scan/route.ts  # Currency scan API
│       └── fraud-network/route.ts  # Fraud network API
├── tailwind.config.js
├── tsconfig.json
└── package.json
```


