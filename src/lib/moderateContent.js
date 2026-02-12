import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Extract JSON from Claude's response
 * Handles markdown code blocks and plain text
 */
function extractJSON(text) {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }
  // Try to find JSON object in the text
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return JSON.parse(objectMatch[0]);
  }
  // If no match, try parsing the whole text
  return JSON.parse(text);
}

/**
 * Moderate a community post using Claude AI
 * @param {Object} post - The post to moderate
 * @param {string} post.content - Post content
 * @param {string} post.scam_type - Scam type (Phone, Text, Email, Online)
 * @returns {Object} Moderation result with approved, score, reason, pii_detected
 */
export async function moderatePost(post) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `You are a content moderator for a scam reporting community platform. Analyze this user-submitted scam report and determine if it should be approved or rejected.

APPROVE if:
- It describes a legitimate scam attempt (phone, text, email, or online)
- Contains helpful details that would warn others
- Does not contain personal information (PII) like SSN, credit card numbers, full street addresses
- Is not spam, advertising, or off-topic
- Uses respectful language
- Provides enough context to be useful (more than just "got a scam call")

REJECT if:
- Not about a scam (general complaint, question, unrelated content)
- Contains PII that should be redacted:
  * Social Security Numbers (XXX-XX-XXXX pattern)
  * Credit card numbers (16-digit sequences)
  * Full street addresses with house numbers
  * Excessive phone numbers without context
- Spam, advertising, or promotional content
- Profanity, hate speech, or harassment
- Too vague to be helpful (e.g., "got a scam call" with no details)
- Gibberish or nonsensical text

Scam Type: ${post.scam_type}
Content: """
${post.content}
"""

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "approved": true or false,
  "score": <0-100, quality score where 100 is excellent, 0 is terrible>,
  "reason": "<one sentence explaining decision>",
  "pii_detected": ["<list any PII found>"] or []
}

If PII is detected, set approved=false and explain in reason.`,
        },
      ],
    });

    const result = extractJSON(message.content[0].text);

    return {
      approved: result.approved && result.score >= 60, // Auto-approve if score >= 60
      score: result.score,
      reason: result.reason,
      pii_detected: result.pii_detected || [],
    };
  } catch (error) {
    console.error("Post moderation error:", error);
    // On error, default to requiring manual review
    return {
      approved: false,
      score: 0,
      reason: "Moderation failed - manual review required",
      pii_detected: [],
    };
  }
}

/**
 * Moderate a comment using Claude AI
 * (Lighter checks than posts)
 * @param {Object} comment - The comment to moderate
 * @param {string} comment.content - Comment content
 * @returns {Object} Moderation result with approved, score, reason
 */
export async function moderateComment(comment) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `You are a content moderator for a scam reporting community platform. Analyze this comment and determine if it should be approved or rejected.

APPROVE if:
- Provides helpful context or advice
- Shares a similar experience
- Asks a relevant question
- Offers support or empathy
- Uses respectful language

REJECT if:
- Spam or promotional content
- Profanity, hate speech, or harassment
- Off-topic or irrelevant
- Contains PII (SSN, credit cards, addresses)
- Gibberish or nonsensical

Comment: """
${comment.content}
"""

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "approved": true or false,
  "score": <0-100, quality score>,
  "reason": "<one sentence explaining decision>"
}`,
        },
      ],
    });

    const result = extractJSON(message.content[0].text);

    return {
      approved: result.approved && result.score >= 70, // Auto-approve if score >= 70 (higher threshold for comments)
      score: result.score,
      reason: result.reason,
    };
  } catch (error) {
    console.error("Comment moderation error:", error);
    // On error, default to requiring manual review
    return {
      approved: false,
      score: 0,
      reason: "Moderation failed - manual review required",
    };
  }
}
