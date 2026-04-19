# MERai — Development Log

## 1. Initial Product Direction

The brief was to build a SaaS prototype for Meridian Projects, a mid-large EPC company drowning in document chaos during project closeouts. Their handovers take 6 months longer than they should because decisions live in meeting transcripts, emails, and scattered reports that nobody can trace.

I initially considered a generic dashboard—something like a BI tool with charts. Scrapped that within minutes. A founder doesn't want to see another dashboard. They want to see a *product that solves the problem*.

## 2. Why MERai

MERai exists because the root issue isn't "lack of data" — it's "lack of clarity." The data exists across meeting minutes, transcripts, and emails. Nobody has time to read it all. An AI copilot that ingests the mess and produces structured intelligence is the product.

Three modules emerged naturally from the problem:
- **Handover Readiness** — What's missing, what's blocking closeout?
- **Decision Intelligence** — What was decided, what's contradicting, what's pending?
- **Project Memory** — Ask any question, get an answer from the files.

## 3. Stack Decision

Chose React + Vite + Tailwind CSS over Next.js or Streamlit. Reasoning:
- Vite gives instant hot-reload for rapid iteration.
- Tailwind lets you build premium UI fast without writing custom CSS files.
- No need for SSR or backend routing — this is a client-side prototype.
- OpenAI calls are made directly from the browser via the official SDK.

## 4. Reversals and Changes

### v1: Static mock data
The first version used hardcoded arrays for decisions and readiness scores. This was fine for a visual demo but fell apart the moment you asked "what if I upload a different file?"

### v2: Fully dynamic
Rewrote all three modules to be 100% dynamic. On upload, the app now:
1. Reads every `.txt` file via `FileReader`
2. Sends the combined text to OpenAI to extract readiness data (JSON)
3. Sends a second call to extract decisions (JSON)
4. Both responses populate the dashboard dynamically
5. The chat module uses the same document context for Q&A

This means anyone can clone the repo, upload their own files, and get real results.

### Multi-file upload
Initial version only accepted a single file. Fixed this — you can now select multiple `.txt` files, see them listed, remove individual files, and process them all at once.

## 5. Where AI Helped

- **Scaffolding**: The entire Vite + React + Tailwind project structure was generated in under a minute.
- **UI Components**: Sidebar, upload zone, chat interface, settings modal — all generated with proper styling out of the box.
- **OpenAI Integration**: The service module with structured JSON prompts was generated correctly on the first attempt.
- **Bug Fixes**: When Tailwind v4 broke the build (PostCSS plugin moved to a separate package), I fed the terminal error back to the AI and it diagnosed and fixed the issue autonomously — uninstalled the broken deps, installed the correct stable version, and updated configs. Took about 30 seconds.

## 6. Where AI Failed

- **Tailwind Version Mismatch**: The AI initially configured Tailwind v4 syntax (`@tailwindcss/postcss`) but had installed the v3 package. This caused a full build crash. The error was clear in the terminal and the AI fixed it on the second attempt with zero manual intervention from me.
- **Single-file lock**: The first upload implementation only handled one file. Had to explicitly ask for multi-file support.

## 7. How Problems Were Caught

- Every change was validated by running `npm run dev` and checking the browser.
- Build errors showed up immediately in the terminal.
- The AI caught and fixed its own mistakes when given the error output.
- Manual effort on my end was minimal — mostly reviewing the output and deciding what to iterate on.

## 8. What Was Cut

- **PDF/DOCX parsing**: Browser-side binary parsing is brittle. Scoped to `.txt` for reliability.
- **Authentication**: No login — drops you straight into the product.
- **Persistent storage**: No database. State resets on refresh. Fine for a demo.
- **Streaming responses**: Chat responses arrive all at once, not streamed token-by-token.

## 9. What Would Be Built Next

- **Real RAG pipeline**: LangChain or LlamaIndex for chunking and embedding large document sets.
- **PDF/DOCX support**: Server-side parsing with Python (PyMuPDF, python-docx).
- **Multi-user + roles**: Project Manager, Client, Licensor each see different views.
- **ERP integration**: Pull ground-truth data from SAP/Aconex to cross-verify AI findings.
- **Streaming chat**: Token-by-token response rendering for better UX.
- **Document versioning**: Track changes across uploaded file revisions.

## 10. Reflection

Speed matters, but what sells a prototype is *specificity*. A generic AI chat is boring. An AI that reads your actual meeting transcript and tells you "the water treatment scope is contradicted between FEED Rev 2 and the Licensor's verbal agreement" — that's a product. 

AI handled 90% of the boilerplate. My job was product thinking — choosing the right modules, structuring the prompts correctly, and making sure every pixel communicated "this is a real product." The hardest part wasn't code. It was deciding what to cut and what to keep.
