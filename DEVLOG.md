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
- Native filesystem parsing via `pdfjs-dist` and `mammoth` keeps all data client-side before going to the LLM.

## 4. Testing Against Real Needs (Gap Analysis)

After initially testing with mock files, I ran a deep gap analysis against a set of actual crisis documents (a CEO email complaining of late handovers, a VP's email calling out verbal decisions not reaching procurement, and an engineer lamenting a deleted Teams channel).

This revealed that the prototype was generally solving the right *strategic* problems, but had several *functional* gaps:
- It only parsed TXT files, while Meridian uses DOCX and PDFs.
- It extracted the overarching decision, but completely missed "accountability" — who was supposed to notify procurement?
- Contradictions across documents (e.g., an email saying SS316L, a transcript saying Duplex 2205) were not visually loud enough to stop a 22 Lakh INR rework mistake.

## 5. Iterations and UI Improvements

To address the gap analysis findings:
- **Added PDF & DOCX Support**: Integrated `pdfjs-dist` and `mammoth` into the frontend so users can drop in realistic project files rather than just raw text.
- **Approval Chains**: Upgraded the Decision Intelligence module. Decisions now expand to reveal an explicit chain: *Decided By → Agreed By → Action Owner → Must Notify*.
- **Contradiction Banner**: The Readiness Dashboard now has a prominent amber banner solely for calling out cross-document disagreements that require urgent human resolution.
- **Pre-loaded Chat Suggestions**: To guide first-time users (like the CEO), the Project Memory page now includes demo questions that can be clicked instantly.

## 6. The Hallucination Problem & "STRICT Mode"

**Problem**: During testing on the real dataset, the AI claimed there were "33 Unresolved Items" and "8 Missing Documents". In reality, the documents only mentioned 4 unresolved items and 3 missing documents. The AI was literally inventing items to pad the numbers because my original prompt told it to use "sensible defaults."

**Fix**: I completely rewrote the internal prompts into what I call **STRICT Mode**. 
- The AI is commanded to extract *only* what is explicitly named or strongly implied in the text.
- No inferring, no defaults, no padding.
- For chat queries, if someone asks something not in the text, it explicitly responds: *"I could not find this information in the uploaded documents."*

## 7. Migration from OpenAI to Google Gemini

Originally wired to OpenAI's GPT-4o-mini. I migrated the entire service layer to **Google Gemini 2.5 Flash** natively using `@google/generative-ai`.
- **Why?** It parses long document contexts faster, has an incredibly huge token context window (ideal for 2,000+ page datasets), and is highly precise on classification tasks when in strict mode.
- **Challenges:** Encountered a `404 not found` error during migration because I used a deprecated model string (`gemini-1.5-flash-latest`). Once identified via terminal logs, the fallback and upgrade to the official stable `gemini-2.5-flash` model resolved it instantly.

## 8. Where AI Helped

- **Rapid Refactoring**: Generating the complex PDF/DOCX loaders dynamically inside React.
- **React Components**: Expanding the decision cards and managing complex UI state (accordions, multi-stage approval visual components) was built safely and accurately.
- **Debugging**: The AI completely self-diagnosed the Gemini syntax error from the NPM trace.

## 9. Reflection

Building a SaaS product isn't about throwing data at an LLM; it's about restricting the LLM to only provide the intelligence the business explicitly requires. Moving from "generative" AI to "extractive" AI (STRICT mode) fundamentally changed the utility of the application from a "cool demo" to a "dependable tool." 

The application is now entirely dynamic, format-agnostic, zero-hallucination, and strictly tied to actual project data.
