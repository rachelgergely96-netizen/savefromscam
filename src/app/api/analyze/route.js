import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    if (text.length > 5000) {
      return Response.json(
        { error: "Text too long. Maximum 5000 characters." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a scam detection expert. Analyze the following message and determine if it is likely a scam or legitimate.

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "verdict": "HIGH RISK — LIKELY SCAM" or "MEDIUM RISK — SUSPICIOUS" or "LOW RISK — LIKELY SAFE",
  "confidence": <number 0-100>,
  "tactics": [
    {
      "name": "<tactic name like 'Urgency Pressure' or 'Emotional Manipulation'>",
      "score": <severity 0-100>,
      "desc": "<one sentence explaining how this tactic is used in the message>"
    }
  ],
  "summary": "<2-3 sentence explanation of why this is or isn't a scam>",
  "actions": ["<recommended action 1>", "<recommended action 2>", "<recommended action 3>"]
}

Include 2-5 tactics. If the message appears legitimate, still analyze it but give low scores.

Message to analyze:
"""
${text}
"""`,
        },
      ],
    });

    const responseText = message.content[0].text;
    const result = JSON.parse(responseText);

    return Response.json(result);
  } catch (error) {
    console.error("Scam analysis error:", error);

    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return Response.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
