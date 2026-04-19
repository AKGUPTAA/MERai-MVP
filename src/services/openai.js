import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Shared Gemini AI service used by all modules.
 * Uses gemini-2.5-flash — current stable model as of April 2026.
 */

function getModel(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

/**
 * Analyze uploaded documents and extract structured handover readiness data.
 * STRICT mode: only counts things explicitly mentioned in the documents.
 */
export async function analyzeReadiness(apiKey, documentContext) {
  const model = getModel(apiKey);

  const prompt = `You are an expert EPC project closeout analyst. Analyze ONLY the provided project documents below.

CRITICAL RULES:
- Count ONLY items that are explicitly mentioned or strongly implied in the documents.
- Do NOT invent, assume, or add items that are not in the text.
- Do NOT use "sensible defaults" — if the text does not say it, do not include it.
- unresolvedItems = the count of open/pending/TBD/unconfirmed action points you found in the text.
- validatedItems = the count of items explicitly confirmed, approved, or signed-off in the text.
- missingDocuments = documents explicitly stated as missing, not submitted, not available, or requested but not yet provided.
- score = your honest assessment of readiness (0=nothing done, 100=everything complete and signed off).

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON) with this exact structure:
{
  "score": <number 0-100>,
  "status": "<On Track | At Risk | Critical>",
  "missingDocuments": [{"name": "<exact doc name from text>", "impact": "<High|Medium|Low>", "owner": "<person or team from text>"}],
  "unresolvedItems": <count only items explicitly open in the text>,
  "validatedItems": <count only items explicitly confirmed in the text>,
  "actions": [{"title": "<action from text>", "desc": "<exactly what the text says needs to happen>", "due": "<urgency mentioned in text, or 'Not specified'>"}],
  "complianceGaps": <number explicitly mentioned, or 0 if not stated>
}

Project Documents:
${documentContext}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Extract decisions, contradictions, pending items, and risks from documents.
 * STRICT mode: only extracts items with clear evidence in the text.
 */
export async function analyzeDecisions(apiKey, documentContext) {
  const model = getModel(apiKey);

  const prompt = `You are an expert EPC decision tracker. Analyze ONLY the provided project documents.

CRITICAL RULES:
- Extract ONLY decisions, contradictions, and risks that are explicitly stated in the text.
- Do NOT invent items. If something is not clearly in the text, do not include it.
- Quote or closely paraphrase the actual source when writing descriptions.
- For contradictions: only flag them when two documents or speakers clearly disagree on the same point.
- For dates: only use dates explicitly mentioned. Otherwise use "Not specified".

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON):
{
  "decisions": [
    {
      "id": <number>,
      "title": "<short title of the decision or issue>",
      "status": "<Approved | Pending | Contradiction | Risk>",
      "description": "<what the text actually says>",
      "impact": "<impact as stated or clearly implied in text>",
      "owner": "<person or role named in text>",
      "date": "<date from text or 'Not specified'>"
    }
  ]
}

Classify as:
- Approved: explicitly stated as approved, confirmed, or agreed
- Pending: stated as open, under discussion, TBD, to be confirmed
- Contradiction: two sources in the documents disagree on the same fact
- Risk: explicit risk, delay, cost impact, or escalation mentioned

Project Documents:
${documentContext}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Chat with project memory — answers questions using document context only.
 */
export async function chatWithMemory(apiKey, documentContext, chatHistory, userMessage) {
  const model = getModel(apiKey);

  const history = chatHistory.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const systemContext = `You are MERai, an expert AI copilot for EPC project teams.

STRICT RULES:
- Answer based ONLY on what is written in the document context below.
- If the answer is not in the documents, say exactly: "I could not find this information in the uploaded documents."
- Never guess, infer, or hallucinate facts not present in the text.
- Cite the specific document, person, or date from the text when answering.
- Be concise and professional.

Document Context:
${documentContext || '(No documents uploaded yet)'}

---`;

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(`${chatHistory.length === 0 ? systemContext + '\n\n' : ''}${userMessage}`);
  return result.response.text();
}
