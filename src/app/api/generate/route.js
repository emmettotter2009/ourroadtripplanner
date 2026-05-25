import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

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

    const { prompt, messages, maxTokens, stream } = await request.json();
    const msgs = messages || [{ role: "user", content: prompt }];

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Streaming path
    if (stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            const anthropicStream = await client.messages.stream({
              model: "claude-sonnet-4-5",
              max_tokens: maxTokens || 4000,
              messages: msgs,
            });

            for await (const chunk of anthropicStream) {
              if (
                chunk.type === "content_block_delta" &&
                chunk.delta?.type === "text_delta"
              ) {
                controller.enqueue(encoder.encode(chunk.delta.text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Accel-Buffering": "no",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Non-streaming path
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: maxTokens || 4000,
      messages: msgs,
    });

    const text = message.content?.find((b) => b.type === "text")?.text || "";
    return Response.json({ text });

  } catch (error) {
    console.error("Anthropic API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
