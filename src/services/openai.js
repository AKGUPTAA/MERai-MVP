import OpenAI from 'openai';

/**
 * Shared OpenAI service used by all modules.
 * Every function takes apiKey + documentContext so components stay stateless.
 */

function getClient(apiKey) {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

/**
 * Analyze uploaded documents and extract structured handover readiness data.
 * Returns: { score, missingDocuments[], unresolvedItems[], actions[], complianceGaps[] }
 */
export async function analyzeReadiness(apiKey, documentContext) {
  const client = getClient(apiKey);
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an expert EPC project closeout analyst. Analyze the provided project documents and produce a handover readiness assessment.

Return ONLY valid JSON with this exact structure:
{
  "score": <number 0-100>,
  "status": "<On Track | At Risk | Critical>",
  "missingDocuments": [{"name": "<doc name>", "impact": "<High|Medium|Low>", "owner": "<person or team>"}],
  "unresolvedItems": <number>,
  "validatedItems": <number>,
  "actions": [{"title": "<action>", "desc": "<details>", "due": "<urgency>"}],
  "complianceGaps": <number>
}

Be thorough. Infer missing documents and unresolved items from context clues in the text (e.g., someone says "I will check", "TBD", "pending", "not sure", "deferred"). If the documents don't contain enough info for a field, provide reasonable defaults.`
      },
      {
        role: 'user',
        content: `Here are the uploaded project documents:\n\n${documentContext}`
      }
    ]
  });
  return JSON.parse(res.choices[0].message.content);
}

/**
 * Extract decisions, contradictions, pending items, and risks from documents.
 * Returns: { decisions: [{title, status, description, impact, owner, date}] }
 */
export async function analyzeDecisions(apiKey, documentContext) {
  const client = getClient(apiKey);
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an expert EPC decision tracker. Analyze the provided project documents and extract every decision, pending action, contradiction, and risk.

Return ONLY valid JSON with this structure:
{
  "decisions": [
    {
      "id": <number>,
      "title": "<short title>",
      "status": "<Approved | Pending | Contradiction | Risk>",
      "description": "<what happened / what the issue is>",
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

Be thorough. Extract ALL decisions and issues.`
      },
      {
        role: 'user',
        content: `Here are the uploaded project documents:\n\n${documentContext}`
      }
    ]
  });
  return JSON.parse(res.choices[0].message.content);
}

/**
 * Chat with project memory — answers questions using document context.
 */
export async function chatWithMemory(apiKey, documentContext, chatHistory, userMessage) {
  const client = getClient(apiKey);
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: `You are MERai, an expert AI copilot for EPC project teams. Answer questions accurately based ONLY on the provided document context.

Rules:
- Be concise and professional.
- Cite specific people, dates, and document references when available.
- If the answer is not in the documents, say "I could not find this information in the uploaded documents."
- Never hallucinate or make up information.

Document Context:
${documentContext || '(No documents uploaded yet)'}`
      },
      ...chatHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: userMessage }
    ]
  });
  return res.choices[0].message.content;
}
