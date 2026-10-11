// Server-side rules for every call to the Claude API.
// This file has no external imports so it can be unit tested with plain Node
// (see tests/aiRequest.test.js). Prompts themselves still live in
// components/RoadTripPlanner.jsx and are NOT changed here.

export const MODEL = "claude-sonnet-5-5";

// Claude Sonnet 5.5 runs "adaptive thinking" by default, which spends output
// tokens (billed) before writing the answer. Sonnet 4.5 did not think by
// default, so "between_tools" keeps today's behavior: no up-front thinking.
// Note: { type: "disabled" } is rejected by Sonnet 5.5.
export const THINKING = { type: "between_tools" };

// USD per million tokens for Claude Sonnet 5.5 (Anthropic pricing page,
// checked October 11, 2026). Used only to estimate cost in the usage log.
export const PRICING = {
  input: 2.0,
  output: 10.0,
  cacheWrite5m: 2.5,
  cacheRead: 0.1,
};

// Token limits are owned by the server, not the browser.
// Sonnet 5.5's tokenizer produces about 30% more tokens for the same text,
// so each limit is the old Sonnet 4.5 limit x 1.3 to keep the same length.
//   itinerary 4000 -> 5200, markers/scenic 2000 -> 2600, chat 1000 -> 1300
export const KINDS = {
  itinerary: { maxTokens: 5200, maxPromptChars: 12000 },
  markers: { maxTokens: 2600, maxPromptChars: 4000 },
  scenic: { maxTokens: 2600, maxPromptChars: 4000 },
  chat: { maxTokens: 1300, maxMessages: 8, maxMessageChars: 12000, maxTotalChars: 40000 },
};

// Opening words of each prompt built in RoadTripPlanner.jsx. Only used to
// recognize requests from a page that was loaded before this release (those
// pages do not send `kind`).
const PROMPT_OPENERS = {
  itinerary: "You are a warm, practical road trip planner",
  markers: "You are a knowledgeable road trip historian",
  scenic: "You are an expert on scenic byways",
};

export class RequestError extends Error {
  constructor(status, userMessage, reason) {
    super(userMessage);
    this.status = status;
    this.reason = reason; // short code for logs, never shown to users
  }
}

const GENERIC_INPUT_ERROR =
  "Something about this request didn't look right. Please refresh the page and try again.";

function inferKind(body) {
  if (Array.isArray(body.messages)) return "chat";
  if (typeof body.prompt === "string") {
    for (const [kind, opener] of Object.entries(PROMPT_OPENERS)) {
      if (body.prompt.startsWith(opener)) return kind;
    }
  }
  return null;
}

// Validates the browser's request and returns exactly what will be sent to
// Claude. Anything the browser sends about token limits is ignored.
export function resolveRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RequestError(400, GENERIC_INPUT_ERROR, "body_not_object");
  }

  const kind = typeof body.kind === "string" && KINDS[body.kind] ? body.kind : inferKind(body);
  if (!kind) throw new RequestError(400, GENERIC_INPUT_ERROR, "unknown_kind");
  const cfg = KINDS[kind];

  if (kind === "chat") {
    const msgs = body.messages;
    if (!Array.isArray(msgs) || msgs.length === 0 || msgs.length > cfg.maxMessages) {
      throw new RequestError(400, GENERIC_INPUT_ERROR, "chat_message_count");
    }
    let total = 0;
    const clean = msgs.map((m) => {
      if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
        throw new RequestError(400, GENERIC_INPUT_ERROR, "chat_message_shape");
      }
      const content = m.content.trim();
      if (!content) throw new RequestError(400, GENERIC_INPUT_ERROR, "chat_message_empty");
      if (content.length > cfg.maxMessageChars) {
        throw new RequestError(413, "That message is too long. Please shorten it and try again.", "chat_message_too_long");
      }
      total += content.length;
      return { role: m.role, content };
    });
    if (total > cfg.maxTotalChars) {
      throw new RequestError(413, "This conversation is too long. Please refresh to start a new chat.", "chat_total_too_long");
    }
    if (clean[0].role !== "user" || clean[clean.length - 1].role !== "user") {
      throw new RequestError(400, GENERIC_INPUT_ERROR, "chat_role_order");
    }
    return { kind, maxTokens: cfg.maxTokens, messages: clean };
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) throw new RequestError(400, GENERIC_INPUT_ERROR, "prompt_missing");
  if (prompt.length > cfg.maxPromptChars) {
    throw new RequestError(
      413,
      "Your trip details are longer than we can handle. Please shorten your notes and try again.",
      "prompt_too_long"
    );
  }
  return { kind, maxTokens: cfg.maxTokens, messages: [{ role: "user", content: prompt }] };
}

// Joins the text blocks of a Claude response. Sonnet 5.5 responses can include
// thinking blocks, so blocks are read by type, never by position.
export function extractText(message) {
  return (message?.content || [])
    .filter((b) => b && b.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("")
    .trim();
}

// Decides whether a response is safe to show.
// Returns { ok: true, incomplete } or { ok: false, status, userMessage, reason }.
export function checkResponse(kind, message, text) {
  const stop = message?.stop_reason;

  if (stop === "refusal") {
    return {
      ok: false,
      status: 422,
      userMessage: "We couldn't build a plan from these details. Please adjust your trip details and try again.",
      reason: "refusal",
    };
  }
  if (stop === "model_context_window_exceeded") {
    return {
      ok: false,
      status: 413,
      userMessage: "This request is too long for the planner. Please shorten it and try again.",
      reason: "context_window",
    };
  }
  if (!text) {
    return {
      ok: false,
      status: 502,
      userMessage: "The planner didn't return a response. Please try again.",
      reason: "empty_text",
    };
  }

  if (kind === "itinerary") {
    // A cut-off itinerary is never shown, saved to trip history, or emailed.
    if (stop === "max_tokens") {
      return {
        ok: false,
        status: 502,
        userMessage:
          "Your itinerary came out longer than expected and wasn't finished. Please try again, or try a shorter trip.",
        reason: "itinerary_truncated",
      };
    }
    if (!/\bDay\s*1\b/i.test(text)) {
      return {
        ok: false,
        status: 502,
        userMessage: "The planner returned something that wasn't an itinerary. Please try again.",
        reason: "itinerary_no_day_1",
      };
    }
  }

  // Bonus panels and chat keep today's behavior: a cut-off answer is still
  // shown, but it is flagged in the usage log so we can see how often it happens.
  return { ok: true, incomplete: stop === "max_tokens" };
}

export function estimateCostUsd(usage = {}) {
  const input = usage.input_tokens || 0;
  const output = usage.output_tokens || 0;
  const cacheWrite = usage.cache_creation_input_tokens || 0;
  const cacheRead = usage.cache_read_input_tokens || 0;
  const usd =
    (input * PRICING.input +
      output * PRICING.output +
      cacheWrite * PRICING.cacheWrite5m +
      cacheRead * PRICING.cacheRead) /
    1_000_000;
  return Math.round(usd * 1_000_000) / 1_000_000;
}

// One log record per Claude call. Contains no prompt text, no response text,
// no IP address, and no traveler details.
export function usageRecord({ kind, message, durationMs, env, incomplete }) {
  const usage = message?.usage || {};
  return {
    event: "ortp_ai_usage",
    kind,
    model: message?.model || MODEL,
    env: env || "unknown",
    stop_reason: message?.stop_reason || null,
    incomplete: Boolean(incomplete),
    input_tokens: usage.input_tokens || 0,
    output_tokens: usage.output_tokens || 0,
    cache_write_tokens: usage.cache_creation_input_tokens || 0,
    cache_read_tokens: usage.cache_read_input_tokens || 0,
    est_cost_usd: estimateCostUsd(usage),
    duration_ms: durationMs,
  };
}

// Maps Anthropic API errors to a message that is safe to show visitors.
// Raw API errors (which can mention billing or account details) stay in logs.
export function userMessageForApiError(err) {
  const status = err?.status;
  if (status === 429 || status === 529 || (typeof status === "number" && status >= 500)) {
    return { status: 503, message: "The trip planner is busy right now. Please try again in a minute." };
  }
  return { status: 500, message: "Something went wrong building your trip. Please try again." };
}
