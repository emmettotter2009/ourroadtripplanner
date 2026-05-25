export const runtime = "edge";

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    // Edge-compatible rate limiting via Upstash REST API directly
    const rateLimitRes = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/pipeline`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", `ratelimit:${ip}`],
          ["EXPIRE", `ratelimit:${ip}`, 3600],
        ]),
      }
    );
    const rateLimitData = await rateLimitRes.json();
    const requestCount = rateLimitData[0]?.result ?? 0;

    if (requestCount > 10) {
      return Response.json(
        { error: "You've made too many requests this hour — please wait before trying again." },
        { status: 429 }
      );
    }

    const { prompt, messages, maxTokens, stream } = await request.json();
    const msgs = messages || [{ role: "user", content: prompt }];

    // Streaming path
    if (stream) {
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "anthropic-beta": "messages-2023-12-15",
              },
              body: JSON.stringify({
                model: "claude-sonnet-4-5",
                max_tokens: maxTokens || 4000,
                stream: true,
                messages: msgs,
              }),
            });

            if (!anthropicRes.ok) {
              const err = await anthropicRes.text();
              controller.error(new Error(err));
              return;
            }

            const reader = anthropicRes.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
              for (const line of lines) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed?.delta?.text;
                  if (text) controller.enqueue(encoder.encode(text));
                } catch {}
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
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: maxTokens || 4000,
        messages: msgs,
      }),
    });

    const data = await anthropicRes.json();
    const text = data.content?.find((b) => b.type === "text")?.text || "";
    return Response.json({ text });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
