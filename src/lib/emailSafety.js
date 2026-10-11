// Helpers that keep the email endpoint from being used to send arbitrary
// content from trips@ourroadtripplanner.com. No external imports, so this
// can be unit tested with plain Node (see tests/emailSafety.test.js).

export const FEEDBACK_ADDRESS = "ourroadtripplanner@gmail.com";
export const MAX_ITINERARY_CHARS = 50000;
const MAX_FIELD_CHARS = 200;

// Escapes text so it is shown as text in the email, never treated as HTML.
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Plain one-line text: no line breaks, trimmed, length-capped.
export function cleanField(value, max = MAX_FIELD_CHARS) {
  return String(value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

export function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length < 254;
}

// The visitor's itinerary text, escaped first, then given the same light
// formatting as before (bold and blue "Day N" headers). Because escaping
// happens first, any HTML in the text arrives as harmless visible text.
export function itineraryToEmailHtml(itinerary) {
  return escapeHtml(itinerary)
    .replace(/\[CITY:[^\]]+\]/gi, "")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /^#{1,3}\s*(Day\s+\d+[^\n]*)/gm,
      '<h2 style="font-size:16px;color:#fff;background:#2563eb;padding:8px 12px;border-radius:6px;margin-top:24px;">$1</h2>'
    )
    .replace(/\n/g, "<br/>");
}

// Decides whether a send request looks like a real itinerary email or a
// feedback note. Returns null when OK, or a short reason code when not.
export function rejectReason({ to, itinerary }) {
  if (!to || typeof itinerary !== "string" || !itinerary.trim()) return "missing_fields";
  if (!isValidEmail(to)) return "invalid_email";
  if (itinerary.length > MAX_ITINERARY_CHARS) return "too_large";
  const isFeedback = to.trim().toLowerCase() === FEEDBACK_ADDRESS;
  if (!isFeedback && !/\bDay\s*1\b/i.test(itinerary)) return "not_an_itinerary";
  return null;
}
