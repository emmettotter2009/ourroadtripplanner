import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  MODEL,
  THINKING,
  RequestError,
  resolveRequest,
  extractText,
  checkResponse,
  usageRecord,
  userMessageForApiError,
} from "../../../lib/aiRequest";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
});

const ENV = process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown";

// Logs a request that was turned away before reaching Claude. No IP, no content.
const logRejected = (reason, kind = null) =>
  console.warn(JSON.stringify({ event: "ortp_ai_rejected", reason, kind, env: ENV }));

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      logRejected("rate_limited");
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

    let body;
    try {
      body = await request.json();
    } catch {
      logRejected("invalid_json");
      return Response.json({ error: "Something about this request didn't look right. Please refresh the page and try again." }, { status: 400 });
    }

    // Validates the request and sets the token limit on the server.
    // Any `maxTokens` value sent by the browser is ignored.
    let req;
    try {
      req = resolveRequest(body);
    } catch (e) {
      if (e instanceof RequestError) {
        logRejected(e.reason, body?.kind || null);
        return Response.json({ error: e.message }, { status: e.status });
      }
      throw e;
    }

    const started = Date.now();
    let message;
    try {
      message = await client.messages.create({
        model: MODEL,
        max_tokens: req.maxTokens,
        thinking: THINKING,
        messages: req.messages,
      });
    } catch (err) {
      // Full error stays in server logs; visitors get a plain message.
      console.error(
        JSON.stringify({
          event: "ortp_ai_error",
          kind: req.kind,
          env: ENV,
          status: err?.status || null,
          type: err?.error?.error?.type || err?.name || null,
          message: String(err?.message || "").slice(0, 300),
        })
      );
      const { status, message: userMessage } = userMessageForApiError(err);
      return Response.json({ error: userMessage }, { status });
    }

    const text = extractText(message);
    const verdict = checkResponse(req.kind, message, text);

    console.log(
      JSON.stringify(
        usageRecord({
          kind: req.kind,
          message,
          durationMs: Date.now() - started,
          env: ENV,
          incomplete: verdict.ok ? verdict.incomplete : true,
        })
      )
    );

    if (!verdict.ok) {
      logRejected(verdict.reason, req.kind);
      return Response.json({ error: verdict.userMessage, incomplete: true }, { status: verdict.status });
    }

    return Response.json(verdict.incomplete ? { text, incomplete: true } : { text });
  } catch (error) {
    console.error(
      JSON.stringify({ event: "ortp_ai_error", env: ENV, stage: "unexpected", message: String(error?.message || "").slice(0, 300) })
    );
    return Response.json({ error: "Something went wrong building your trip. Please try again." }, { status: 500 });
  }
}
