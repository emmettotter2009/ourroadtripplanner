import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FEEDBACK_ADDRESS,
  escapeHtml,
  cleanField,
  itineraryToEmailHtml,
  rejectReason,
} from "../src/lib/emailSafety.js";

test("HTML in an itinerary is shown as text, not rendered", () => {
  const out = itineraryToEmailHtml('Day 1: <a href="https://evil.example">Click</a><script>x()</script>');
  assert.ok(!out.includes("<a "));
  assert.ok(!out.includes("<script"));
  assert.ok(out.includes("&lt;a href=&quot;https://evil.example&quot;&gt;"));
});

test("existing email formatting still works after escaping", () => {
  const out = itineraryToEmailHtml("### Day 1: Desert Start\n**Lunch** at Diner & Co's\n[CITY:Flagstaff]");
  assert.ok(out.includes('<h2 style="font-size:16px;color:#fff;background:#2563eb;'));
  assert.ok(out.includes("Day 1: Desert Start</h2>"));
  assert.ok(out.includes("<strong>Lunch</strong>"));
  assert.ok(out.includes("Diner &amp; Co&#39;s"));
  assert.ok(!out.includes("[CITY:"));
  assert.ok(out.includes("<br/>"));
});

test("escapeHtml covers attribute-breaking characters", () => {
  assert.equal(escapeHtml(`"'<>&`), "&quot;&#39;&lt;&gt;&amp;");
  assert.equal(escapeHtml(undefined), "");
});

test("cleanField removes line breaks and caps length", () => {
  assert.equal(cleanField("Mesa,\r\nAZ"), "Mesa, AZ");
  assert.equal(cleanField("x".repeat(500)).length, 200);
  assert.equal(cleanField(null), "");
});

test("real itinerary emails are allowed", () => {
  assert.equal(rejectReason({ to: "parent@example.com", itinerary: "Day 1: Mesa to Flagstaff\n..." }), null);
});

test("feedback to our own inbox is allowed without a Day 1", () => {
  assert.equal(rejectReason({ to: FEEDBACK_ADDRESS, itinerary: "Trip: Mesa → Flagstaff\n\nFeedback: Loved it!" }), null);
});

test("arbitrary content to outside addresses is refused", () => {
  assert.equal(rejectReason({ to: "victim@example.com", itinerary: "You won a prize, click here" }), "not_an_itinerary");
});

test("bad inputs are refused", () => {
  assert.equal(rejectReason({ to: "", itinerary: "Day 1" }), "missing_fields");
  assert.equal(rejectReason({ to: "not-an-email", itinerary: "Day 1" }), "invalid_email");
  assert.equal(rejectReason({ to: "a@b.co", itinerary: "Day 1 " + "x".repeat(50000) }), "too_large");
  assert.equal(rejectReason({ to: "a@b.co", itinerary: 42 }), "missing_fields");
});
