import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
});

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      const resetIn = Math.ceil((reset - Date.now()) / 1000 / 60);
      return Response.json(
        {
          error: `You've generated ${limit} itineraries this hour — please wait ${resetIn} minute${resetIn !== 1 ? "s" : ""} before trying again.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }

    const { prompt, messages, maxTokens } = await request.json();

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
