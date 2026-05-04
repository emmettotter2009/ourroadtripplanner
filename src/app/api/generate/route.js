import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { prompt, messages, maxTokens } = await request.json();

    // Support both single prompt and multi-turn messages
    const msgs = messages || [{ role: "user", content: prompt }];

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: maxTokens || 8000,
      messages: msgs,
    });

    const text = message.content?.find((b) => b.type === "text")?.text || "";
    return Response.json({ text });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
