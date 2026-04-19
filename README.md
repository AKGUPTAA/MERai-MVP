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

### 1. Upload Files
- Click the upload zone and select one or more `.txt` files (meeting transcripts, reports, notes).
- Click **"Analyze with MERai"** to process.
- MERai sends your documents to OpenAI and extracts structured intelligence in real-time.

### 2. Handover Readiness
AI-generated dashboard showing:
- **Readiness Score** (0–100%)
- **Missing Documents** with owners and impact levels
- **Unresolved Items** count
- **Recommended Actions** with urgency

### 3. Decision Intelligence
AI-extracted feed of:
- **Approved** decisions
- **Pending** items
- **Contradictions** between documents
- **Risks** with owners and impact

### 4. Project Memory (Q&A)
Chat interface where you ask natural questions like:
- *"Who approved Duplex 2205?"*
- *"What is still unresolved?"*
- *"What changed after the March review?"*

MERai answers using only your uploaded documents.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Charts | react-circular-progressbar |
| AI | Google Gemini 1.5 Flash |

## Project Structure

```
src/
├── App.jsx                      # Main app with state management
├── services/
│   └── openai.js                # Shared OpenAI API service
├── components/
│   ├── Sidebar.jsx              # Navigation sidebar
│   ├── SettingsModal.jsx        # API key input modal
│   ├── HeroUpload.jsx           # Multi-file upload + processing
│   ├── ReadinessDashboard.jsx   # Dynamic readiness dashboard
│   ├── DecisionIntelligence.jsx # Dynamic decision extraction
│   └── ProjectMemory.jsx        # AI chat interface
```

## Requirements

- Node.js 18+
- A Google Gemini API key (free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

## License

MIT
