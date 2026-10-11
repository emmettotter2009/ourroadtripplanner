import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MODEL,
  THINKING,
  KINDS,
  RequestError,
  resolveRequest,
  extractText,
  checkResponse,
  estimateCostUsd,
  usageRecord,
  userMessageForApiError,
} from "../src/lib/aiRequest.js";

const ITIN = "You are a warm, practical road trip planner. Create a detailed day-by-day road trip itinerary.\n\nTRIP: ...";
const MARK = "You are a knowledgeable road trip historian. For travelers driving from Mesa to Grand Canyon...";
const SCEN = "You are an expert on scenic byways. For a road trip from Mesa to Grand Canyon...";

test("model and thinking match the Sonnet 5.5 migration plan", () => {
  assert.equal(MODEL, "claude-sonnet-5-5");
  assert.deepEqual(THINKING, { type: "between_tools" });
});

test("token limits are the Sonnet 4.5 limits x 1.3", () => {
  assert.equal(KINDS.itinerary.maxTokens, 5200);
  assert.equal(KINDS.markers.maxTokens, 2600);
  assert.equal(KINDS.scenic.maxTokens, 2600);
  assert.equal(KINDS.chat.maxTokens, 1300);
});

test("browser-supplied maxTokens is ignored", () => {
  const r = resolveRequest({ kind: "itinerary", prompt: ITIN, maxTokens: 64000 });
  assert.equal(r.maxTokens, 5200);
});

test("explicit kinds resolve", () => {
  assert.equal(resolveRequest({ kind: "markers", prompt: MARK }).kind, "markers");
  assert.equal(resolveRequest({ kind: "scenic", prompt: SCEN }).kind, "scenic");
});

test("pages loaded before this release (no kind) are recognized by prompt opener", () => {
  assert.equal(resolveRequest({ prompt: ITIN, maxTokens: 4000 }).kind, "itinerary");
  assert.equal(resolveRequest({ prompt: MARK, maxTokens: 2000 }).kind, "markers");
  assert.equal(resolveRequest({ prompt: SCEN, maxTokens: 2000 }).kind, "scenic");
  assert.equal(
    resolveRequest({ messages: [{ role: "user", content: "ctx" }, { role: "user", content: "q" }], maxTokens: 1000 }).kind,
    "chat"
  );
});

test("unknown requests are rejected", () => {
  assert.throws(() => resolveRequest({ prompt: "Write me an essay about anything" }), RequestError);
  assert.throws(() => resolveRequest(null), RequestError);
  assert.throws(() => resolveRequest([]), RequestError);
  assert.throws(() => resolveRequest({ kind: "itinerary", prompt: "   " }), RequestError);
});

test("oversized prompts are rejected with 413", () => {
  const big = ITIN + "x".repeat(KINDS.itinerary.maxPromptChars);
  try {
    resolveRequest({ kind: "itinerary", prompt: big });
    assert.fail("should throw");
  } catch (e) {
    assert.equal(e.status, 413);
  }
});

test("a long but realistic itinerary prompt is accepted", () => {
  const notes = "Our son has a peanut allergy and our daughter gets carsick. ".repeat(60); // ~3,600 chars
  const prompt = ITIN + "x".repeat(3300) + notes;
  assert.ok(prompt.length < KINDS.itinerary.maxPromptChars);
  assert.equal(resolveRequest({ kind: "itinerary", prompt }).kind, "itinerary");
});

test("chat validation: shape, roles, order and size", () => {
  const ok = [
    { role: "user", content: "context" },
    { role: "user", content: "What should we pack?" },
    { role: "assistant", content: "Sunscreen." },
    { role: "user", content: "Any kid stops?" },
  ];
  assert.equal(resolveRequest({ kind: "chat", messages: ok }).messages.length, 4);
  assert.throws(() => resolveRequest({ kind: "chat", messages: [] }), RequestError);
  assert.throws(() => resolveRequest({ kind: "chat", messages: [{ role: "system", content: "x" }] }), RequestError);
  assert.throws(() => resolveRequest({ kind: "chat", messages: [{ role: "user", content: "a" }, { role: "assistant", content: "b" }] }), RequestError);
  assert.throws(() => resolveRequest({ kind: "chat", messages: Array(9).fill({ role: "user", content: "x" }) }), RequestError);
  assert.throws(() => resolveRequest({ kind: "chat", messages: [{ role: "user", content: "x".repeat(12001) }] }), RequestError);
});

test("chat at the app's real maximum (context + 6 history + new question) is accepted", () => {
  const msgs = [{ role: "user", content: "c".repeat(7500) }];
  for (let i = 0; i < 3; i++) {
    msgs.push({ role: "user", content: "q".repeat(300) });
    msgs.push({ role: "assistant", content: "a".repeat(5200) }); // ~1,300 tokens
  }
  msgs.push({ role: "user", content: "last question" });
  assert.equal(msgs.length, 8);
  assert.equal(resolveRequest({ kind: "chat", messages: msgs }).kind, "chat");
});

test("text is read by block type, skipping thinking blocks", () => {
  const msg = { content: [{ type: "thinking", thinking: "", signature: "x" }, { type: "text", text: "Day 1: Go" }] };
  assert.equal(extractText(msg), "Day 1: Go");
  assert.equal(extractText({}), "");
});

test("truncated itineraries are blocked", () => {
  const v = checkResponse("itinerary", { stop_reason: "max_tokens" }, "Day 1: ...");
  assert.equal(v.ok, false);
  assert.equal(v.reason, "itinerary_truncated");
});

test("itineraries without Day 1 are blocked", () => {
  const v = checkResponse("itinerary", { stop_reason: "end_turn" }, "I can't help with that.");
  assert.equal(v.ok, false);
});

test("complete itineraries pass", () => {
  const v = checkResponse("itinerary", { stop_reason: "end_turn" }, "Day 1: Desert Start\n8:00 AM - Depart\n[CITY:Flagstaff]");
  assert.deepEqual(v, { ok: true, incomplete: false });
});

test("refusals and context overflow are blocked for every kind", () => {
  for (const kind of Object.keys(KINDS)) {
    assert.equal(checkResponse(kind, { stop_reason: "refusal" }, "x").ok, false);
    assert.equal(checkResponse(kind, { stop_reason: "model_context_window_exceeded" }, "x").ok, false);
    assert.equal(checkResponse(kind, { stop_reason: "end_turn" }, "").ok, false);
  }
});

test("bonus panels and chat keep today's behavior when cut off, but are flagged", () => {
  assert.deepEqual(checkResponse("markers", { stop_reason: "max_tokens" }, "Region 1..."), { ok: true, incomplete: true });
  assert.deepEqual(checkResponse("chat", { stop_reason: "max_tokens" }, "Sure..."), { ok: true, incomplete: true });
});

test("cost estimate uses Sonnet 5.5 prices", () => {
  // 1,300 in x $2/M + 2,600 out x $10/M = 0.0026 + 0.026
  assert.equal(estimateCostUsd({ input_tokens: 1300, output_tokens: 2600 }), 0.0286);
  assert.equal(estimateCostUsd({ input_tokens: 0, output_tokens: 5200 }), 0.052);
  assert.equal(estimateCostUsd(), 0);
});

test("usage log contains no traveler data", () => {
  const rec = usageRecord({
    kind: "itinerary",
    message: {
      model: "claude-sonnet-5-5",
      stop_reason: "end_turn",
      usage: { input_tokens: 1200, output_tokens: 2500 },
      content: [{ type: "text", text: "Day 1: secret family details, peanut allergy" }],
    },
    durationMs: 41000,
    env: "preview",
    incomplete: false,
  });
  const s = JSON.stringify(rec);
  assert.ok(!/peanut|secret|Day 1/.test(s));
  assert.deepEqual(Object.keys(rec).sort(), [
    "cache_read_tokens", "cache_write_tokens", "duration_ms", "env", "est_cost_usd", "event",
    "incomplete", "input_tokens", "kind", "model", "output_tokens", "stop_reason",
  ]);
});

test("API errors map to safe visitor messages", () => {
  assert.equal(userMessageForApiError({ status: 529 }).status, 503);
  assert.equal(userMessageForApiError({ status: 429 }).status, 503);
  const billing = userMessageForApiError({ status: 400, message: "Your credit balance is too low" });
  assert.equal(billing.status, 500);
  assert.ok(!/credit/i.test(billing.message));
});
