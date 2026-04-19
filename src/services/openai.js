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
- Count ONLY items explicitly mentioned or strongly implied in the documents.
- Do NOT invent, assume, or pad numbers.
- unresolvedItems = count of open/pending/TBD/unconfirmed items in the text.
- validatedItems = count of items explicitly confirmed, approved, or signed-off.
- missingDocuments = documents explicitly stated as missing, not submitted, or requested but not provided.
- contradictions = list of cases where two sources clearly disagree on the same fact.
- score = honest 0-100 readiness assessment.

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON):
{
  "score": <number 0-100>,
  "status": "<On Track | At Risk | Critical>",
  "missingDocuments": [{"name": "<exact doc name>", "impact": "<High|Medium|Low>", "owner": "<person or team>"}],
  "unresolvedItems": <number>,
  "validatedItems": <number>,
  "actions": [{"title": "<action>", "desc": "<what needs to happen>", "due": "<urgency>"}],
  "complianceGaps": <number>,
  "contradictions": [{"title": "<short label>", "detail": "<what the contradiction is>"}]
}

Project Documents:
${documentContext}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Extract decisions with full approval chains.
 * STRICT mode: only items with clear evidence in the text.
 */
export async function analyzeDecisions(apiKey, documentContext) {
  const model = getModel(apiKey);

  const prompt = `You are an expert EPC decision tracker. Analyze ONLY the provided project documents.

CRITICAL RULES:
- Extract ONLY decisions/contradictions/risks that are explicitly in the text.
- Do NOT invent items. No hallucination.
- For approval chain fields: only fill in names/roles explicitly stated in the text.
- If a field has no clear evidence in the text, use "Not specified" or an empty array.
- For dates: use dates from the text only.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "decisions": [
    {
      "id": <number>,
      "title": "<short title>",
      "status": "<Approved | Pending | Contradiction | Risk>",
      "description": "<what the text actually says>",
      "impact": "<impact stated or clearly implied in text>",
      "date": "<date from text or 'Not specified'>",
      "chain": {
        "decidedBy": "<person/role who made the decision, from text>",
        "agreedBy": ["<person/role who agreed, from text>"],
        "actionOwner": "<person/role assigned the action, from text>",
        "shouldNotify": ["<person/role who should be informed but may not have been, inferred from text>"]
      }
    }
  ]
}

Classify as:
- Approved: explicitly agreed by all parties
- Pending: open, TBD, under discussion, to be confirmed
- Contradiction: two sources in documents disagree on same fact
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
- If the answer is not in the documents, say: "I could not find this in the uploaded documents."
- Never guess or hallucinate. Cite specific people, dates, and document references when available.
- Be concise and professional.

Document Context:
${documentContext || '(No documents uploaded yet)'}
---`;

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(`${chatHistory.length === 0 ? systemContext + '\n\n' : ''}${userMessage}`);
  return result.response.text();
}
