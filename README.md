# MERai — Turning Chaos into Clarity

An AI-powered project intelligence copilot for EPC teams. Upload messy project files — meeting transcripts, minutes, reports — and MERai turns them into structured handover readiness assessments, decision tracking, and a searchable project memory.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/AKGUPTAA/MERai-MVP.git
cd MERai-MVP

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Setup

1. On first launch, a modal will ask for your **Gemini API Key**.
2. Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). It is stored locally in your browser — never sent anywhere except Google AI.
3. You can change the key anytime via **API Settings** in the sidebar.

## How It Works

### 1. Multi-Format File Upload
- Click the upload zone and select one or more `.txt`, `.pdf`, or `.docx` files (meeting transcripts, reports, notes).
- Click **"Analyze with MERai"** to process.
- MERai sends your documents to Gemini and extracts structured intelligence in real-time.

### 2. Handover Readiness
AI-generated dashboard showing:
- **Readiness Score** (0–100%)
- **Missing Documents** with owners and impact levels
- **Unresolved Items** count
- **Contradictions Banner**: Dynamically surfaces disagreements across multiple documents.
- **Recommended Actions** with urgency

### 3. Decision Intelligence
AI-extracted feed of:
- **Approved** decisions
- **Pending** items
- **Contradictions** between documents
- **Risks** with owners and impact
- **Approval Chains**: Visual breakdown showing specifically who *Decided*, *Agreed*, *Owned*, and *Must Be Notified* for total accountability.

### 4. Project Memory (Q&A)
Chat interface where you ask natural questions like:
- *"Who approved Duplex 2205?"*
- *"What is still unresolved?"*
- *"What changed after the March review?"*

MERai operates in **STRICT Mode**: it answers using only your uploaded documents, cites sources, and explicitly refuses to hallucinate facts not in evidence. Includes pre-loaded demo questions for easy testing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Document Parsing | pdfjs-dist (PDF), mammoth (DOCX) |
| Icons | Lucide React |
| Charts | react-circular-progressbar |
| AI | Google Gemini 2.5 Flash |

## Project Structure

```
src/
├── App.jsx                      # Main app with state management
├── services/
│   └── openai.js                # Shared Gemini API service (using STRICT mode)
├── components/
│   ├── Sidebar.jsx              # Navigation sidebar with dynamic file status
│   ├── SettingsModal.jsx        # API key input modal
│   ├── HeroUpload.jsx           # Multi-file upload + native PDF/DOCX processing
│   ├── ReadinessDashboard.jsx   # Dynamic readiness dashboard with Contradictions banner
│   ├── DecisionIntelligence.jsx # Dynamic decision extraction and Approval Chain visual
│   └── ProjectMemory.jsx        # AI chat interface with strict citation controls
```

## Requirements

- Node.js 18+
- A Google Gemini API key (free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

## License

MIT
