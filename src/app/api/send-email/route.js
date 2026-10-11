import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  FEEDBACK_ADDRESS,
  escapeHtml,
  cleanField,
  itineraryToEmailHtml,
  rejectReason,
} from "../../../lib/emailSafety";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
});

// Site-wide ceiling on emails per day, so a spread-out abuse attempt cannot
// burn the sending quota or the domain's reputation. Adjust with the
// EMAIL_DAILY_CAP environment variable if real usage ever approaches it.
const DAILY_CAP = Number(process.env.EMAIL_DAILY_CAP) || 150;
const dailyLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(DAILY_CAP, "1 d"),
  prefix: "ortp_email_daily",
});

const ENV = process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown";
const logEmail = (outcome, reason = null) =>
  console.log(JSON.stringify({ event: "ortp_email", outcome, reason, env: ENV }));

const REJECT_MESSAGES = {
  missing_fields: { status: 400, error: "Missing email or itinerary" },
  invalid_email: { status: 400, error: "Please enter a valid email address." },
  too_large: { status: 400, error: "Itinerary too large to send." },
  not_an_itinerary: { status: 400, error: "We could only send a trip itinerary to that address." },
};

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const { success } = await ratelimit.limit(`email:${ip}`);
    if (!success) {
      logEmail("rejected", "rate_limited");
      return Response.json(
        { error: "Too many email requests — please wait before trying again." },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      logEmail("rejected", "invalid_json");
      return Response.json({ error: "Missing email or itinerary" }, { status: 400 });
    }
    const to = typeof body?.to === "string" ? body.to.trim() : "";
    const itinerary = typeof body?.itinerary === "string" ? body.itinerary : "";

    const reason = rejectReason({ to, itinerary });
    if (reason) {
      logEmail("rejected", reason);
      const { status, error } = REJECT_MESSAGES[reason];
      return Response.json({ error }, { status });
    }

    // Trip details are plain text only, trimmed and length-capped.
    const rawTrip = body?.trip && typeof body.trip === "object" ? body.trip : {};
    const trip = {
      start: cleanField(rawTrip.start),
      end: cleanField(rawTrip.end),
      depart: /^\d{4}-\d{2}-\d{2}$/.test(rawTrip.depart || "") ? rawTrip.depart : "",
    };

    // Visitors' itineraries get a subject built here, so the endpoint can't be
    // used to send arbitrary subject lines. Feedback notes keep theirs (they
    // only ever reach our own inbox).
    const isFeedback = to.toLowerCase() === FEEDBACK_ADDRESS;
    const subject = isFeedback
      ? cleanField(body?.subject, 150) || "Feedback"
      : `Your Road Trip: ${trip.start} to ${trip.end}`.slice(0, 150);

    const { success: underDailyCap } = await dailyLimit.limit("all");
    if (!underDailyCap) {
      logEmail("rejected", "daily_cap");
      return Response.json(
        { error: "We've hit today's email limit. Please use the PDF button to save your trip, and try email again tomorrow." },
        { status: 429 }
      );
    }

    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY)
      return Response.json(
        { error: "Email not configured yet" },
        { status: 500 }
      );
    const GYG_PARTNER_ID = "CKJU4TS";
    const CJ_CID = "101740591";
    const BOOKING_LINK_ID = "17293132";

    // CJ deep link: wraps a Booking.com destination URL so the affiliate cookie is set on redirect
    const buildBookingDeepLink = (bookingUrl) =>
      `https://www.kqzyfj.com/click-${CJ_CID}-${BOOKING_LINK_ID}?url=${encodeURIComponent(bookingUrl)}`;

    // Add days to a YYYY-MM-DD date string, returning YYYY-MM-DD (or "" if no/invalid date)
    const addDays = (isoDate, days) => {
      if (!isoDate) return "";
      const d = new Date(isoDate + "T00:00:00");
      if (isNaN(d.getTime())) return "";
      d.setDate(d.getDate() + days);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const buildHotelUrl = (city, checkIn, checkOut) => {
      let dest = `https://www.booking.com/searchresults.html?ss=${city || ""}`;
      if (checkIn && checkOut) dest += `&checkin=${checkIn}&checkout=${checkOut}`;
      return buildBookingDeepLink(dest);
    };

    const buildGYGUrl = (city) => {
      const encoded = encodeURIComponent(city);
      return `https://www.getyourguide.com/s/?q=${encoded}&partner_id=${GYG_PARTNER_ID}&utm_medium=online_publisher`;
    };

    const buildCarUrl = () => buildBookingDeepLink("https://www.booking.com/cars/index.html");

    // Extract [CITY:X] tags and day titles from itinerary
    const cityMatches = [...itinerary.matchAll(/\[CITY:([^\]]+)\]/gi)];
    const dayMatches = [...itinerary.matchAll(/^(?:#{1,3}\s*)?(Day\s+\d+[^\n]*)/gmi)];

    const nights = cityMatches.map((m, i) => ({
      city: m[1].trim(),
      label: dayMatches[i] ? dayMatches[i][1].replace(/^#+\s*/, "").trim() : `Night ${i + 1}`,
    }));

    // Build booking checklist HTML
    const bookingRows = nights.map((night, i) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; font-size: 13px; color: #374151;">
          <strong style="color: #111;">${escapeHtml(night.label)}</strong><br/>
          <span style="color: #6b7280; font-size: 12px;">${escapeHtml(night.city)}</span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: right; white-space: nowrap;">
          ${i > 0 ? `<a href="${buildHotelUrl(night.city, addDays(trip.depart, i), addDays(trip.depart, i + 1))}" style="color: #D85A30; text-decoration: none; font-size: 13px; margin-right: 12px;">🏨 Hotels</a>` : ""}
          <a href="${buildGYGUrl(night.city)}" style="color: #D85A30; text-decoration: none; font-size: 13px;">🎟️ Activities</a>
        </td>
      </tr>
    `).join("");

    const bookingSection = nights.length > 0 ? `
      <div style="margin: 24px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background: #2C2C2A; padding: 12px 16px;">
          <h3 style="color: #F5F5F0; font-size: 15px; margin: 0;">📋 Book your trip</h3>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0;">Quick links for each stop on your itinerary</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; background: white;">
          ${bookingRows}
          <tr>
            <td style="padding: 10px 12px; font-size: 13px; color: #374151;">
              <strong style="color: #111;">Car rental</strong><br/>
              <span style="color: #6b7280; font-size: 12px;">Compare all major companies</span>
            </td>
            <td style="padding: 10px 12px; text-align: right;">
              <a href="${buildCarUrl()}" style="color: #D85A30; text-decoration: none; font-size: 13px;">🚗 Compare rentals</a>
            </td>
          </tr>
        </table>
        <div style="padding: 8px 12px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
          <p style="font-size: 11px; color: #9ca3af; margin: 0;">Affiliate links — we may earn a small commission at no cost to you. <a href="https://ourroadtripplanner.com/affiliate-disclosure" style="color: #9ca3af;">Learn more</a></p>
        </div>
      </div>
    ` : "";

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: #2C2C2A; padding: 20px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
          <h1 style="font-size: 22px; color: #F5F5F0; margin: 0;">🗺️ Your Road Trip Itinerary</h1>
          <p style="color: #D85A30; font-size: 13px; margin: 6px 0 0; letter-spacing: 0.1em;">EVERY ROAD · YOUR WAY™</p>
        </div>
        <h2 style="font-size: 18px; color: #111;">${escapeHtml(trip.start)} → ${escapeHtml(trip.end)}</h2>
        ${trip.depart ? `<p style="color: #6b7280; font-size: 14px;">Departing ${escapeHtml(trip.depart)}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <div style="font-size: 14px; line-height: 1.8; color: #374151;">
          ${itineraryToEmailHtml(itinerary)}
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        ${bookingSection}
        <div style="text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <p style="font-size: 13px; color: #374151; margin: 0 0 8px;">Want to plan another trip?</p>
          <a href="https://ourroadtripplanner.com" style="display: inline-block; background: #D85A30; color: white; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-family: sans-serif;">Plan another trip ↗</a>
        </div>
        <div style="text-align: center; padding: 16px;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Generated by <a href="https://ourroadtripplanner.com" style="color: #2563eb;">ourroadtripplanner.com</a></p>
          <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0;">AI-generated itinerary for planning purposes only. Always verify conditions before travel.</p>
        </div>
      </div>
    `;

    const fromAddresses = [
      "Our Road Trip Planner <trips@ourroadtripplanner.com>",
      "Our Road Trip Planner <onboarding@resend.dev>"
    ];
    let lastError = null;
    for (const from of fromAddresses) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({ from, to, subject, html: htmlBody }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        logEmail(isFeedback ? "sent_feedback" : "sent");
        return Response.json({ success: true });
      }
      lastError = `${res.status} ${String(data?.name || data?.message || "send_failed").slice(0, 120)}`;
    }
    throw new Error(lastError);
  } catch (e) {
    // Provider details stay in the server log; visitors get a plain message.
    console.error(JSON.stringify({ event: "ortp_email", outcome: "error", env: ENV, message: String(e?.message || "").slice(0, 300) }));
    return Response.json({ error: "We couldn't send that email right now. Please try again later." }, { status: 500 });
  }
}
