import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Shared Gemini AI service used by all modules.
 * Uses gemini-1.5-flash for fast, cost-effective analysis.
 */

function getModel(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
}

/**
 * Analyze uploaded documents and extract structured handover readiness data.
 */
export async function analyzeReadiness(apiKey, documentContext) {
  const model = getModel(apiKey);

  const prompt = `You are an expert EPC project closeout analyst. Analyze the provided project documents and produce a handover readiness assessment.

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON) with this exact structure:
{
  "score": <number 0-100>,
  "status": "<On Track | At Risk | Critical>",
  "missingDocuments": [{"name": "<doc name>", "impact": "<High|Medium|Low>", "owner": "<person or team>"}],
  "unresolvedItems": <number>,
  "validatedItems": <number>,
  "actions": [{"title": "<action>", "desc": "<details>", "due": "<urgency e.g. Today|This Week|ASAP>"}],
  "complianceGaps": <number>
}

Infer missing documents and unresolved items from context clues (e.g., "I will check", "TBD", "pending", "not sure", "deferred"). If a field cannot be determined, use sensible defaults.

Project Documents:
${documentContext}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Extract decisions, contradictions, pending items, and risks from documents.
 */
export async function analyzeDecisions(apiKey, documentContext) {
  const model = getModel(apiKey);

  const prompt = `You are an expert EPC decision tracker. Analyze the provided project documents and extract every decision, pending action, contradiction, and risk.

Return ONLY valid JSON (no markdown, no code blocks, just raw JSON) with this structure:
{
  "decisions": [
    {
      "id": <number>,
      "title": "<short title>",
      "status": "<Approved | Pending | Contradiction | Risk>",
      "description": "<what happened or what the issue is>",
      "impact": "<business impact>",
      "owner": "<responsible person>",
      "date": "<date if mentioned, otherwise 'Not specified'>"
    }
  ]
}

Look for:
- Explicit approvals or sign-offs
- Items marked TBD, pending, deferred
- Contradictions where two sources disagree
- Risks from delays, cost overruns, or unclear ownership
- Action items assigned to specific people

Extract ALL decisions and issues found.

Project Documents:
${documentContext}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Chat with project memory — answers questions using document context.
 */
export async function chatWithMemory(apiKey, documentContext, chatHistory, userMessage) {
  const model = getModel(apiKey);

  // Build conversation history for multi-turn chat
  const history = chatHistory.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const systemContext = `You are MERai, an expert AI copilot for EPC project teams. Answer questions accurately based ONLY on the provided document context.

Rules:
- Be concise and professional.
- Cite specific people, dates, and document references when available.
- If the answer is not in the documents, say "I could not find this information in the uploaded documents."
- Never hallucinate or make up information.

Document Context:
${documentContext || '(No documents uploaded yet)'}

---`;

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(`${chatHistory.length === 0 ? systemContext + '\n\n' : ''}${userMessage}`);
  return result.response.text();
}
