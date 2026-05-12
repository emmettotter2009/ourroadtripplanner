export async function POST(request) {
  try {
    const { to, subject, itinerary, trip } = await request.json();
    if (!to || !itinerary) return Response.json({ error: "Missing email or itinerary" }, { status: 400 });
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) return Response.json({ error: "Email not configured yet" }, { status: 500 });

    const AWIN_ID = "2880651";
    const AWIN_MID = "6776";
    const GYG_PARTNER_ID = "CKJU4TS";

    const buildHotelUrl = (city) => {
      const encoded = encodeURIComponent(city);
      return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_ID}&ued=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3D${encoded}`;
    };

    const buildGYGUrl = (city) => {
      const encoded = encodeURIComponent(city);
      return `https://www.getyourguide.com/s/?q=${encoded}&partner_id=${GYG_PARTNER_ID}&utm_medium=online_publisher`;
    };

    const buildCarUrl = () =>
      `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_ID}&campaign=CarRentals&ued=https%3A%2F%2Fwww.booking.com%2Fcars%2Findex.html`;

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
          <strong style="color: #111;">${night.label}</strong><br/>
          <span style="color: #6b7280; font-size: 12px;">${night.city}</span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: right; white-space: nowrap;">
          ${i > 0 ? `<a href="${buildHotelUrl(night.city)}" style="color: #D85A30; text-decoration: none; font-size: 13px; margin-right: 12px;">🏨 Hotels</a>` : ""}
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
        <h2 style="font-size: 18px; color: #111;">${trip.start} → ${trip.end}</h2>
        ${trip.depart ? `<p style="color: #6b7280; font-size: 14px;">Departing ${trip.depart}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <div style="font-size: 14px; line-height: 1.8; color: #374151;">
          ${itinerary
            .replace(/\[CITY:[^\]]+\]/gi, "")
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/^#{1,3}\s*(Day\s+\d+[^\n]*)/gm, '<h2 style="font-size:16px;color:#fff;background:#2563eb;padding:8px 12px;border-radius:6px;margin-top:24px;">$1</h2>')
            .replace(/\n/g, '<br/>')
          }
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
      const data = await res.json();
      if (res.ok) return Response.json({ success: true });
      lastError = data.message || "Failed to send";
    }
    throw new Error(lastError);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
