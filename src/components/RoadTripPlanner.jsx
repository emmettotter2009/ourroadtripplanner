"use client";
import { useState, useEffect } from "react";

const STEPS = ["The Trip", "Your Crew", "Stops & Stays", "Final Touches"];

const Tag = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: 20, fontSize: 13,
    border: selected ? "1.5px solid #2563eb" : "1px solid #d1d5db",
    background: selected ? "#dbeafe" : "white",
    color: selected ? "#1e40af" : "#6b7280",
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
  }}>{label}</button>
);

const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 6 }}>
      {label}{required && <span style={{ color: "#dc2626", marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", padding: "8px 10px", fontSize: 14,
  border: "1px solid #d1d5db", borderRadius: 8,
  fontFamily: "inherit", color: "#111", outline: "none", boxSizing: "border-box",
};

const DRAFT_KEY = "roadtrip_draft";
const AWIN_ID = "2880651";
const AWIN_MID = "6776";

const buildBookingUrl = (city, type = "hotels") => {
  const base = "https://www.awin1.com/cread.php";
  const params = `awinmid=${AWIN_MID}&awinaffid=${AWIN_ID}`;
  if (type === "cars") {
    return `${base}?${params}&campaign=CarRentals&ued=https%3A%2F%2Fwww.booking.com%2Fcars%2Findex.html`;
  }
  const encoded = encodeURIComponent(city || "");
  return `${base}?${params}&ued=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3D${encoded}`;
};




export default function RoadTripPlanner() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    start: "", end: "", depart: "", arrive: "", ret: "", stops: "",
    withKids: true, kids: [], adults: 2, vehicle: "", accommodation: [],
    driveNormal: 4, driveMax: 7, considerations: [],
    hotels: [], food: [],
    breakfast: "8:00 AM", lunch: "12:00 PM", dinner: "6:00 PM",
    interests: [], budget: "moderate", extra: "",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [kidInput, setKidInput] = useState("");
  const [markers, setMarkers] = useState(null);
  const [markersLoading, setMarkersLoading] = useState(false);
  const [scenic, setScenic] = useState(null);
  const [scenicLoading, setScenicLoading] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [tripHistory, setTripHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [viewingTrip, setViewingTrip] = useState(null);
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm(JSON.parse(saved));
      const history = localStorage.getItem("roadtrip_history");
      if (history) setTripHistory(JSON.parse(history));
      const cityData = JSON.parse(localStorage.getItem("roadtrip_cities") || "{}");
      const topCity = Object.entries(cityData).sort((a,b) => b[1]-a[1])[0];
      if (topCity && topCity[1] >= 2) {
        setForm(f => ({ ...f, start: f.start || topCity[0] }));
      }
    } catch(e) {}
  }, []);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (key, val) => setForm(f => ({
    ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
  }));

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    } catch(e) {}
  };

  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch(e) {} };

  const saveToHistory = (itineraryText) => {
    try {
      const trip = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        start: form.start,
        end: form.end,
        depart: form.depart,
        withKids: form.withKids,
        vehicle: form.vehicle,
        itinerary: itineraryText,
      };
      const existing = JSON.parse(localStorage.getItem("roadtrip_history") || "[]");
      const updated = [trip, ...existing].slice(0, 20);
      localStorage.setItem("roadtrip_history", JSON.stringify(updated));
      setTripHistory(updated);
      if (form.start) {
        const cities = JSON.parse(localStorage.getItem("roadtrip_cities") || "{}");
        cities[form.start] = (cities[form.start] || 0) + 1;
        localStorage.setItem("roadtrip_cities", JSON.stringify(cities));
      }
    } catch(e) {}
  };

  const deleteTrip = (id) => {
    try {
      const updated = tripHistory.filter(t => t.id !== id);
      localStorage.setItem("roadtrip_history", JSON.stringify(updated));
      setTripHistory(updated);
    } catch(e) {}
  };

  const addKid = () => {
    const age = parseInt(kidInput);
    if (!isNaN(age) && age >= 0 && age <= 17) { upd("kids", [...form.kids, age]); setKidInput(""); }
  };

  const buildPrompt = () => {
    const travelerDesc = form.withKids
      ? `Adults: ${form.adults}, Kids: ${form.kids.length ? form.kids.map(a => `age ${a}`).join(", ") : "not specified"}`
      : `Adults only: ${form.adults} adult(s) — NO children`;
    const isCamping = form.accommodation.some(a => /camp|rv|glamp/i.test(a));
    return `You are a warm, practical road trip planner. Create a detailed day-by-day road trip itinerary.

TRIP:
- From: ${form.start || "not specified"}
- To: ${form.end || "not specified"}
- Departure: ${form.depart || "not specified"}
${form.arrive ? `- Must arrive by: ${form.arrive} (hard deadline)` : ""}
- Return: ${form.ret || "open-ended"}
${form.stops ? `- Must-see stops: ${form.stops}` : ""}

TRAVELERS: ${travelerDesc}
${form.considerations.length ? `- Considerations: ${form.considerations.join(", ")}` : ""}

VEHICLE: ${form.vehicle || "not specified"} — factor into route and weather recommendations
ACCOMMODATION: ${form.accommodation.length ? form.accommodation.join(", ") : "no preference"}
${isCamping ? "- Include campground names, reservation tips, setup/breakdown time" : ""}

DRIVING LIMITS:
- Normal day: max ${form.driveNormal} hours
- Max push day: ${form.driveMax} hours (1-2 times only)

MEALS: Breakfast ${form.breakfast}, Lunch ${form.lunch}, Dinner ${form.dinner}
Food preferences: ${form.food.length ? form.food.join(", ") : "flexible"}

INTERESTS: ${form.interests.length ? form.interests.join(", ") : "not specified"}
BUDGET: ${form.budget}
${form.extra ? `NOTES: ${form.extra}` : ""}

For EACH day include:
- Day number and fun title
- Total driving time
- Timed schedule with departure, lunch, afternoon activity, ${isCamping ? "campground arrival" : "hotel check-in"}, dinner
- Specific food stop recommendations
- ${isCamping ? "Campground recommendation with booking tips" : "Accommodation recommendation"}
- 1-2 activity suggestions matching interests
- One traveler tip
${form.vehicle === "motorcycle" ? "- Weather and road surface warnings for motorcycles" : ""}
${form.vehicle === "2WD" ? "- Flag roads requiring AWD or problematic for 2WD" : ""}
${form.vehicle === "electric vehicle" ? `- Suggest appropriate EV charging stops: ${(() => { const t = (form.start + ' ' + form.end).toLowerCase(); const intl = ['uk','england','scotland','wales','ireland','france','germany','spain','italy','netherlands','belgium','portugal','switzerland','austria','norway','sweden','denmark','finland','australia','canada','mexico','japan','new zealand'].some(c => t.includes(c)); return intl ? 'use Ionity, Fastned, Pod Point, or local networks for the region; mention Zap-Map (UK) or ABRP where relevant' : 'use Tesla Supercharger, ChargePoint, or EVgo; note range between charges and flag legs with limited infrastructure'; })()} ` : ""}

Use real town names and businesses. Start directly with Day 1.

TRIP LENGTH — follow this exactly:
${form.ret ? `- Return date is set: plan days accordingly` : `- No return date given: estimate the minimum driving days needed to reach the destination, then add 1 bonus day for exploration. Cap at 6 days total. Do not pad with extra days.`}
- Prioritize a direct, logical route. Do not add detours or extra overnight stops unless they serve a specific listed interest.

STYLE — use Option B format for every day:
- Maximum 4 stops per day — quality over quantity, no cramming
- For each stop write exactly 1 sentence of specific detail. Maximum 30 words. Lead with the single most useful or compelling thing to know:
  - Restaurants: name one specific dish or describe the vibe in one punchy sentence
  - Hotels: name one amenity most relevant to this specific traveler
  - Activities & parks: say what makes it worth stopping, not just what it is
  - Quirky/roadside stops: say what makes it weird or special
- Start each day with: "Day X: [Title]" on its own line
- Use "8:00 AM - " format for times (always include AM/PM)
- Do NOT use ### or ## or # markdown headers anywhere
- Do NOT use bullet points with * or -
- Label traveler tips as: "Traveler Tip: [text]"
- Keep each item on its own line
- Use plain text only, no markdown formatting symbols

CITY TAGS — required for every day:
- At the very end of each day's content, on its own line, add: [CITY:CityName]
- CityName must be the actual city where travelers sleep that night (e.g. [CITY:Sedona] or [CITY:Grand Canyon])
- Use only the city name, no state, no extra words
- This tag is required on every single day, no exceptions

CONFIDENCE RULES — follow exactly:
- For every specific restaurant, cafe, diner, or bar you recommend: silently assess your confidence that it currently exists and is operating
- If HIGH confidence: recommend it with full rich detail
- If LOW confidence: silently replace it with your most confident alternative — never show flagging to the user
- Never use words like "verify", "confirm", "check ahead", or "⚠️" next to any specific business name
- Always show only your most confident recommendation with no hedging symbols or language`;
  };

  const generate = async () => {
    setLoading(true); setError(null); setItinerary(null);
    try {
      const resp = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(), maxTokens: 8000 }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      if (!data.text) throw new Error("No response received.");
      setItinerary(data.text);
      saveToHistory(data.text);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  const callAPI = async (prompt) => {
    const resp = await fetch("/api/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, maxTokens: 4000 }),
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    return data.text || "";
  };

  const fetchMarkers = async () => {
    setMarkersLoading(true); setMarkers(null);
    try {
      const text = await callAPI(`You are a knowledgeable road trip historian. For travelers driving from ${form.start} to ${form.end}${form.stops ? ` with stops at ${form.stops}` : ""}, list notable historical markers, monuments, and points of interest along the way. For each: name and location, 2-3 sentence significance, stop required or visible from road, interest rating 1-5 stars with reason. Group by region. Start directly with first marker.`);
      setMarkers(text);
    } catch(e) { setMarkers("Error: " + e.message); } finally { setMarkersLoading(false); }
  };

  const fetchScenic = async () => {
    setScenicLoading(true); setScenic(null);
    try {
      const text = await callAPI(`You are an expert on scenic byways. For a road trip from ${form.start} to ${form.end}${form.stops ? ` via ${form.stops}` : ""}${form.vehicle ? ` by ${form.vehicle}` : ""}, suggest alternate scenic routes for specific days. For each: which day/segment, route name, extra time added, what makes it worth it, ${form.vehicle === "motorcycle" ? "motorcycle suitability" : "ease of drive"}, one dont-miss moment. Start directly with first suggestion.`);
      setScenic(text);
    } catch(e) { setScenic("Error: " + e.message); } finally { setScenicLoading(false); }
  };

  const sendEmail = async () => {
    if (!emailAddr || !itinerary) return;
    setEmailSending(true);
    try {
      const resp = await fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailAddr, subject: `Your Road Trip: ${form.start} to ${form.end}`, itinerary, trip: { start: form.start, end: form.end, depart: form.depart } }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setEmailSent(true); setShowEmailForm(false);
    } catch(e) { alert("Could not send: " + e.message); } finally { setEmailSending(false); }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    try {
      const context = `You are a helpful road trip assistant. The traveler has this itinerary:\n\n${itinerary}\n\nTrip details: From ${form.start} to ${form.end}${form.depart ? `, departing ${form.depart}` : ""}. ${form.withKids ? `Traveling with kids ages: ${form.kids.join(", ")}` : "Adults only trip"}. Vehicle: ${form.vehicle || "not specified"}. Budget: ${form.budget}.\n\nAnswer their question helpfully and specifically based on their itinerary. Be friendly and concise.`;
      const messages = [
        { role: "user", content: context },
        ...chatMessages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userMsg }
      ];
      const resp = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, maxTokens: 1000 }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setChatMessages(prev => [...prev, { role: "assistant", content: data.text || "" }]);
    } catch(e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't answer that. Please try again!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    const days = parseDays(itinerary);
    const colors = ["#2563eb","#059669","#7c3aed","#d97706","#dc2626","#0891b2","#65a30d"];
    const dayHTML = days.map((day, i) => `
      <div style="margin-bottom:20px; page-break-inside:avoid; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="background:${colors[i % colors.length]}; padding:10px 16px; display:flex; justify-content:space-between;">
          <span style="color:white; font-weight:700; font-size:15px;">${day.title}</span>
        </div>
        <div style="padding:12px 16px; font-size:13px; line-height:1.8; color:#374151;">
          ${day.lines.map(line => {
            const isTip = /traveler tip|parent tip/i.test(line);
            const formatted = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            return isTip
              ? `<div style="background:#fffbeb;border-left:3px solid #f59e0b;padding:4px 10px;margin:6px 0;border-radius:0 4px 4px 0;">${formatted}</div>`
              : `<div>${formatted}</div>`;
          }).join('')}
        </div>
      </div>
    `).join('');
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>Road Trip: ${form.start} to ${form.end}</title>
        <style>body { font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 20px; color: #111; } @media print { body { padding: 0; } .no-print { display: none; } }</style>
      </head><body>
        <div style="background:#2C2C2A; padding:16px; border-radius:8px; margin-bottom:20px; text-align:center;">
          <h1 style="color:#F5F5F0; margin:0; font-size:22px;">🗺️ Your Road Trip Itinerary</h1>
          <p style="color:#D85A30; margin:6px 0 0; font-size:12px; letter-spacing:0.1em;">EVERY ROAD · YOUR WAY · ourroadtripplanner.com</p>
        </div>
        <h2 style="font-size:18px;">${form.start} → ${form.end}</h2>
        <div style="display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; font-family:sans-serif; font-size:13px; color:#6b7280;">
          ${form.depart ? `<span>📅 Departing ${form.depart}</span>` : ''}
          ${form.vehicle ? `<span>🚗 ${form.vehicle}</span>` : ''}
          ${form.withKids ? '<span>👨‍👩‍👧‍👦 Family trip</span>' : '<span>🧑‍🤝‍🧑 Adults only</span>'}
        </div>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        ${dayHTML}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p style="font-size:11px; color:#9ca3af; font-family:sans-serif; text-align:center;">
          AI-generated itinerary for planning purposes only. Always verify conditions before travel.<br/>Generated by ourroadtripplanner.com
        </p>
        <button class="no-print" onclick="window.print()" style="display:block;margin:20px auto;padding:10px 24px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">Print / Save as PDF</button>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const parseDays = (text) => {
    const days = []; const lines = text.split("\n"); let cur = null;
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      if (/^###\s*(Schedule|Accommodation|Activities|Traveler Tip|Trip Summary)/i.test(t)) continue;
      if (/^#{1,3}\s*$/.test(t)) continue;
      if (/^(#{1,3}\s*)?(Day\s+\d+)/i.test(t)) {
        if (cur) days.push(cur);
        cur = { title: t.replace(/^#+\s*/, "").replace(/\*\*/g, "").replace(/^-+\s*/, "").trim(), lines: [], city: "" };
      } else if (cur) {
        // Extract and store city tag, strip from display
        const cityMatch = t.match(/^\[CITY:([^\]]+)\]$/i);
        if (cityMatch) { cur.city = cityMatch[1].trim(); continue; }
        const cleaned = t.replace(/^#{1,3}\s*/, "").replace(/^-\s+/, "").replace(/^\*\s+/, "").trim();
        if (cleaned) cur.lines.push(cleaned);
      }
    }
    if (cur) days.push(cur);
    return days.length ? days : [{ title: "Your Itinerary", lines: text.split("\n").filter(Boolean), city: "" }];
  };

  const formatLine = (line) => {
    const iconMap = [
      [/^(\d+:\d+\s*(AM|PM))/i, "🕐"],
      [/breakfast/i, "🍳"],
      [/lunch/i, "🥪"],
      [/dinner/i, "🍽️"],
      [/hotel|check.in|accommodation|marriott|hilton|hyatt|ihg|hampton|best western|courtyard/i, "🏨"],
      [/camp(ground|site|ing)/i, "⛺"],
      [/activity|activities/i, "🎯"],
      [/traveler tip|parent tip/i, "💡"],
      [/driving time|drive time/i, "🚗"],
      [/gas|fuel/i, "⛽"],
      [/stop|depart|arrive/i, "📍"],
    ];
    let icon = "";
    for (const [pattern, emoji] of iconMap) {
      if (pattern.test(line)) { icon = emoji + " "; break; }
    }
    return (icon + line)
      .replace(/\*\*([^*]+)\*\*/g, (_, m) => `<strong>${m}</strong>`)
      .replace(/^[-•]\s*/, "")
      .replace(/^(💡\s*)(Traveler tip|Parent tip):/i, "$1<strong style='color:#d97706'>$2:</strong>");
  };

  const green = "#059669"; const blue = "#2563eb"; const gray = "#6b7280";
  const btnP = { padding: "9px 24px", fontSize: 14, fontWeight: 600, background: blue, color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" };
  const btnS = { padding: "9px 20px", fontSize: 14, background: "white", color: gray, border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" };
  const btnG = { ...btnP, background: green };

  const BonusPanel = ({ title, emoji, content, loading, onFetch, accentColor, bgColor }) => (
    <div style={{ border: `1px solid ${accentColor}`, borderRadius: 12, marginBottom: "1rem", overflow: "hidden" }}>
      <div style={{ background: bgColor, padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif" }}>{emoji} {title}</span>
        {!content && <button onClick={onFetch} disabled={loading} style={{ padding: "6px 16px", fontSize: 13, fontWeight: 600, background: loading ? "#e5e7eb" : accentColor, color: loading ? "#9ca3af" : "white", border: "none", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Loading..." : "Generate ↗"}</button>}
      </div>
      {content && <div style={{ padding: "1rem 1.25rem" }}>{content.split("\n").filter(Boolean).map((line, i) => <div key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: formatLine(line) }} />)}</div>}
    </div>
  );

  if (itinerary !== null) {
    const days = parseDays(itinerary);
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "Georgia, serif", padding: "0 0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8, fontFamily: "sans-serif" }}>
          <button onClick={() => { setItinerary(null); setStep(0); setMarkers(null); setScenic(null); setEmailSent(false); setShowEmailForm(false); setChatMessages([]); setShowChat(false); clearDraft(); }}
            style={{ fontSize: 13, color: "#6b7280", background: "white", border: "1px solid #d1d5db", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>
            ← Plan a new trip
          </button>
        </div>
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem", color: "white" }}>
          <div style={{ fontSize: 12, fontFamily: "sans-serif", opacity: 0.8, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Your Road Trip Itinerary</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "white", margin: "0 0 4px 0", fontFamily: "Georgia, serif" }}>🗺️ {form.start} → {form.end}</h1>
          <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
            {form.depart && <span style={{ fontSize: 13, fontFamily: "sans-serif", background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20 }}>📅 Departing {form.depart}</span>}
            {form.vehicle && <span style={{ fontSize: 13, fontFamily: "sans-serif", background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20 }}>🚗 {form.vehicle}</span>}
            {form.withKids ? <span style={{ fontSize: 13, fontFamily: "sans-serif", background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20 }}>👨‍👩‍👧‍👦 Family trip</span> : <span style={{ fontSize: 13, fontFamily: "sans-serif", background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20 }}>🧑‍🤝‍🧑 Adults only</span>}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap", fontFamily: "sans-serif" }}>
          <button onClick={() => setShowEmailForm(v => !v)} style={{ ...btnS, fontSize: 13, padding: "7px 16px" }}>📧 Email my itinerary</button>
          {emailSent && <span style={{ fontSize: 13, color: green, alignSelf: "center" }}>✓ Sent!</span>}
          <button onClick={downloadPDF} title="Allow pop-ups if nothing opens" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", fontSize: 13, background: "#dc2626", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
            📄 PDF
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNavDropdown(v => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", fontSize: 13, background: "#111", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
              🗺️ Navigate {showNavDropdown ? "▲" : "▾"}
            </button>
            {showNavDropdown && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 180, zIndex: 100, overflow: "hidden" }}>
                {[
                  { label: "Google Maps", color: "#4285F4", href: (() => {
                    const base = encodeURIComponent(form.start);
                    const dest = encodeURIComponent(form.end);
                    const waypoints = form.stops
                      ? form.stops.split(",").map(s => encodeURIComponent(s.trim())).filter(Boolean).join("/") + "/"
                      : "";
                    return `https://www.google.com/maps/dir/${base}/${waypoints}${dest}`;
                  })() },
                  { label: "Waze", color: "#33CCFF", href: `https://waze.com/ul?q=${encodeURIComponent(form.end)}&navigate=yes` },
                  { label: "Apple Maps", color: "#000", href: `https://maps.apple.com/?saddr=${encodeURIComponent(form.start)}&daddr=${encodeURIComponent(form.end)}` },
                ].map(({ label, color, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setShowNavDropdown(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", fontSize: 13, color: "#374151", textDecoration: "none", borderBottom: "0.5px solid #f3f4f6", fontFamily: "sans-serif" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {showEmailForm && (
          <div style={{ background: "#f0fdf4", border: "1px solid #6ee7b7", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem", fontFamily: "sans-serif" }}>
            <p style={{ fontSize: 13, color: "#065f46", marginBottom: 10, fontWeight: 600 }}>Send your itinerary to your inbox:</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} type="email" placeholder="your@email.com" value={emailAddr} onChange={e => setEmailAddr(e.target.value)} />
              <button onClick={sendEmail} disabled={emailSending} style={{ ...btnG, padding: "8px 16px", fontSize: 13 }}>{emailSending ? "Sending..." : "Send"}</button>
            </div>
          </div>
        )}

        {/* Restaurant disclaimer */}
        <div style={{ background: "#FFF8E7", border: "1px solid #F5E6B8", borderRadius: 10, padding: "10px 14px", marginBottom: "1rem", fontFamily: "sans-serif", fontSize: 13, color: "#78570A", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🍽️</span>
          <span><strong>Restaurant tip:</strong> We recommend specific spots to give you a great starting point — always check Google Maps or Yelp to confirm hours and availability before you go. Things change!</span>
        </div>

        {days.map((day, i) => {
          const driveMatch = day.lines.join(" ").match(/(\d+(\.\d+)?(\.5)?\s*([-–]\s*\d+(\.\d+)?)?\s*hours?)/i);
          const driveTime = driveMatch ? driveMatch[1] : null;
          const colors = ["#2563eb","#059669","#7c3aed","#d97706","#dc2626","#0891b2","#65a30d"];
          const color = colors[i % colors.length];
          const isCamping = form.accommodation.some(a => /camp|rv|glamp/i.test(a));
          const dayCity = day.city || form.end.split(",")[0];

          const timeRegex = /^(\d+:\d+\s*(AM|PM))/i;
          const tipRegex = /traveler tip|parent tip/i;

          const getIcon = (line) => {
            if (/breakfast|coffee|cafe/i.test(line)) return { icon: "☕", bg: "#FEF3C7" };
            if (/lunch/i.test(line)) return { icon: "🥪", bg: "#D1FAE5" };
            if (/dinner/i.test(line)) return { icon: "🍽️", bg: "#FCE7F3" };
            if (/hotel|check.in|lodge|inn|marriott|hilton|hyatt/i.test(line)) return { icon: "🏨", bg: "#DBEAFE" };
            if (/camp/i.test(line)) return { icon: "⛺", bg: "#D1FAE5" };
            if (/depart|leave|start/i.test(line)) return { icon: "🚗", bg: "#E0E7FF" };
            if (/arrive|reach/i.test(line)) return { icon: "📍", bg: "#FEE2E2" };
            if (/museum|historic|monument|park|visit/i.test(line)) return { icon: "🏛️", bg: "#F3E8FF" };
            if (/hike|trail|walk/i.test(line)) return { icon: "🥾", bg: "#D1FAE5" };
            return { icon: "📍", bg: "#F3F4F6" };
          };

          return (
            <div key={i} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: "1rem", overflow: "hidden" }}>
              <div style={{ background: color, padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", fontFamily: "Georgia, serif" }}>{day.title}</div>
                {driveTime && <span style={{ fontSize: 12, background: "rgba(255,255,255,0.25)", color: "white", padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>🚗 {driveTime}</span>}
              </div>
              <div style={{ padding: "1rem 1.25rem", fontFamily: "sans-serif" }}>
                {(() => {
                  const items = [];
                  let currentTime = null;
                  let currentLines = [];

                  const flush = () => {
                    if (currentLines.length > 0) {
                      items.push({ time: currentTime, lines: [...currentLines] });
                      currentLines = [];
                      currentTime = null;
                    }
                  };

                  day.lines.forEach(line => {
                    const timeMatch = line.match(/^(\d+:\d+\s*(AM|PM))/i);
                    if (timeMatch) {
                      flush();
                      currentTime = timeMatch[1];
                      const rest = line.replace(timeMatch[0], "").replace(/^[\s\-–:]+/, "").trim();
                      if (rest) currentLines.push(rest);
                    } else if (tipRegex.test(line)) {
                      flush();
                      items.push({ isTip: true, lines: [line] });
                    } else if (line.trim()) {
                      currentLines.push(line);
                    }
                  });
                  flush();

                  return items.map((item, idx) => {
                    if (item.isTip) {
                      return (
                        <div key={idx} style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", margin: "12px 0", display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                          <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: formatLine(item.lines[0]) }} />
                        </div>
                      );
                    }

                    const mainLine = item.lines[0] || "";
                    const subLines = item.lines.slice(1);
                    const { icon, bg } = getIcon(mainLine);

                    return (
                      <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
                          {item.time && (
                            <div style={{ fontSize: 11, fontWeight: 600, color: color, whiteSpace: "nowrap", marginBottom: 4 }}>{item.time}</div>
                          )}
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
                          {idx < items.length - 1 && !items[idx].isTip && (
                            <div style={{ width: 2, flex: 1, background: "#e5e7eb", minHeight: 16, marginTop: 4 }} />
                          )}
                        </div>
                        <div style={{ paddingBottom: 16, flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: formatLine(mainLine) }} />
                          {subLines.map((sub, si) => (
                            <div key={si} style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginTop: 2 }} dangerouslySetInnerHTML={{ __html: formatLine(sub) }} />
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Per-day affiliate links using structured [CITY:X] tag */}
                <div style={{ borderTop: "1px solid #f3f4f6", marginTop: 8, paddingTop: 10, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                  {i > 0 && !isCamping && (
                    <a href={buildBookingUrl(dayCity)} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13, color: "#D85A30", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      🏨 Search hotels in {dayCity}
                    </a>
                  )}
                  <a href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(dayCity)}&partner_id=CKJU4TS&utm_medium=online_publisher`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: "#D85A30", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    🎟️ Things to do in {dayCity}
                  </a>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>· <a href="/affiliate-disclosure" style={{ color: "#9ca3af", textDecoration: "none" }}>affiliate links</a></span>
                </div>

              </div>
            </div>
          );
        })}

        {/* Car rental — single link for whole trip */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "0.85rem 1.25rem", marginBottom: "1rem", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>🚗 Need a rental car for this trip?</span>
            <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>Compare all major companies in one search</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href={buildBookingUrl(form.end, "cars")} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: "#D85A30", textDecoration: "none" }}>
              Compare car rentals
            </a>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>· <a href="/affiliate-disclosure" style={{ color: "#9ca3af", textDecoration: "none" }}>affiliate link</a></span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem", marginTop: "0.5rem", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: 13, color: gray, fontFamily: "sans-serif", marginBottom: "1rem" }}>✨ Bonus features:</p>
          <BonusPanel title="Historical Markers Along the Way" emoji="🏛️" content={markers} loading={markersLoading} onFetch={fetchMarkers} accentColor="#7c3aed" bgColor="#f5f3ff" />
          <BonusPanel title="Scenic Route Alternatives" emoji="🏞️" content={scenic} loading={scenicLoading} onFetch={fetchScenic} accentColor="#059669" bgColor="#f0fdf4" />
        </div>

        {/* Road Trip Essentials */}
        <div style={{ marginTop: "1.5rem", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", fontFamily: "sans-serif" }}>
          <div style={{ background: "#FF9900", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🛒</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Road Trip Essentials</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginLeft: "auto" }}>Shop on Amazon</span>
          </div>
          <div style={{ padding: "1rem 1.25rem", background: "white" }}>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>Packing for your trip? Here are some essentials other road trippers love:</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ...(!form.withKids ? [] : [
                  { emoji: "🎮", label: "Kids Road Trip Games", q: "kids+road+trip+games+car" },
                  { emoji: "🎧", label: "Kids Headphones", q: "kids+headphones+road+trip" },
                ]),
                ...(form.withKids ? [] : [
                  { emoji: "🎵", label: "Bluetooth Speaker", q: "portable+bluetooth+speaker+outdoor" },
                  { emoji: "🍷", label: "Travel Wine Accessories", q: "travel+wine+accessories" },
                ]),
                ...(form.vehicle === "motorcycle" ? [
                  { emoji: "🎒", label: "Motorcycle Saddlebags", q: "motorcycle+saddlebags+luggage" },
                  { emoji: "🧤", label: "Riding Gloves", q: "motorcycle+riding+gloves" },
                ] : [
                  { emoji: "📱", label: "Phone Car Mount", q: "phone+car+mount+magnetic" },
                  { emoji: "🧊", label: "Portable Car Cooler", q: "portable+car+cooler+12v" },
                ]),
                ...(form.accommodation.some(a => /camp/i.test(a)) ? [
                  { emoji: "🏕️", label: "Camping Chairs", q: "portable+camping+chairs+lightweight" },
                  { emoji: "🔦", label: "Camping Lantern", q: "camping+lantern+led+rechargeable" },
                ] : [
                  { emoji: "🎒", label: "Car Seat Organizer", q: "car+seat+back+organizer" },
                  { emoji: "🗺️", label: "Road Atlas USA", q: "road+atlas+united+states+2024" },
                ]),
                { emoji: "🧴", label: "Travel Toiletry Kit", q: "travel+toiletry+bag+toiletries" },
                { emoji: "💊", label: "Motion Sickness Relief", q: "motion+sickness+relief+travel" },
              ].map(({ emoji, label, q }) => (
                <a key={q} href={`https://www.amazon.com/s?k=${q}&tag=ourroadtrippl-20`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", textDecoration: "none", background: "#fafafa", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#FF9900"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                >
                  <span style={{ fontSize: 18 }}>{emoji}</span>
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{label}</span>
                </a>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 10, textAlign: "center" }}>As an Amazon Associate we earn from qualifying purchases.</p>
          </div>
        </div>

        {/* Chat Dialog */}
        <div style={{ marginTop: "1.5rem", border: "1px solid #2563eb", borderRadius: 12, overflow: "hidden", fontFamily: "sans-serif" }}>
          <div onClick={() => setShowChat(v => !v)} style={{ background: "#2563eb", padding: "0.85rem 1.25rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>💬 Ask about your trip</span>
            <span style={{ color: "white", fontSize: 18 }}>{showChat ? "▼" : "▲"}</span>
          </div>
          {showChat && (
            <div style={{ background: "white" }}>
              <div style={{ padding: "0.75rem 1rem", background: "#f0f7ff", borderBottom: "1px solid #dbeafe" }}>
                <p style={{ fontSize: 12, color: "#1e40af", margin: 0 }}>Ask me anything about your itinerary — weather, packing, detours, restaurant tips, kid activities, and more!</p>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto", padding: "0.75rem 1rem" }}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: "center", padding: "1.5rem", color: "#9ca3af", fontSize: 13 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
                    <p>No questions yet — ask me anything about your trip!</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 12 }}>
                      {["What should we pack?", "What's the weather like?", "Any kid-friendly stops?", "Can we add a detour?"].map(q => (
                        <button key={q} onClick={() => { setChatInput(q); }} style={{ fontSize: 12, padding: "4px 10px", border: "1px solid #dbeafe", borderRadius: 20, background: "#f0f7ff", color: "#1e40af", cursor: "pointer" }}>{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: 12, display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 8 }}>
                    <div style={{ fontSize: 20 }}>{msg.role === "user" ? "👤" : "🗺️"}</div>
                    <div style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: msg.role === "user" ? "#2563eb" : "#f3f4f6", color: msg.role === "user" ? "white" : "#374151", fontSize: 13, lineHeight: 1.6 }}>{msg.content}</div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <div style={{ fontSize: 20 }}>🗺️</div>
                    <div style={{ padding: "8px 12px", borderRadius: "12px 12px 12px 4px", background: "#f3f4f6", fontSize: 13, color: "#9ca3af" }}>Thinking...</div>
                  </div>
                )}
              </div>
              <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1, fontSize: 13 }} placeholder="Ask anything about your trip..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
                <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{ ...btnP, padding: "8px 16px", fontSize: 13, opacity: chatLoading || !chatInput.trim() ? 0.5 : 1 }}>Send</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "2rem", padding: "1.25rem", background: "#f9fafb", borderRadius: 10, fontFamily: "sans-serif", fontSize: 12, color: "#9ca3af", lineHeight: 1.7 }}>
          <p style={{ marginBottom: 8 }}>⚠️ <strong style={{ color: "#6b7280" }}>Disclaimer:</strong> This itinerary is AI-generated for planning purposes only. Driving times are estimates — always verify current road conditions, hotel availability, and restaurant hours before your trip. Our Road Trip Planner is not liable for decisions made based on these suggestions.</p>
          <p>🔗 <strong style={{ color: "#6b7280" }}>Affiliate Disclosure:</strong> This site contains affiliate links. We may earn a small commission when you book through our links, at no extra cost to you. This helps keep the planner free!</p>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e5e7eb", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/terms" style={{ color: "#9ca3af", textDecoration: "none" }}>Terms of Use</a>
            <a href="/privacy" style={{ color: "#9ca3af", textDecoration: "none" }}>Privacy Policy</a>
            <a href="/affiliate-disclosure" style={{ color: "#9ca3af", textDecoration: "none" }}>Affiliate Disclosure</a>
            <span>© 2026 Our Road Trip Planner™</span>
          </div>
        </div>

        <button style={{ ...btnS, marginTop: "1rem" }} onClick={() => { setItinerary(null); setStep(0); setMarkers(null); setScenic(null); setEmailSent(false); setShowEmailForm(false); setChatMessages([]); setShowChat(false); clearDraft(); }}>← Plan a new trip</button>
      </div>
    );
  }

  if (loading) return (
    <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", padding: "4rem 1rem", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 40, marginBottom: 16, animation: "spin 1s linear infinite", display: "inline-block" }}>🚗</div>
      <style>{`@keyframes spin { 0%{transform:translateX(-20px)} 50%{transform:translateX(20px)} 100%{transform:translateX(-20px)} }`}</style>
      <div style={{ fontSize: 16, color: "#111", fontWeight: 600, marginBottom: 8 }}>Building your itinerary...</div>
      <div style={{ fontSize: 13, color: gray }}>This may take up to a minute — good things take time!</div>
    </div>
  );

  if (viewingTrip) {
    const days = parseDays(viewingTrip.itinerary);
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "Georgia, serif", padding: "0 0 2rem" }}>
        <div style={{ padding: "1.5rem 0 1rem", borderBottom: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
          <button onClick={() => setViewingTrip(null)} style={{ ...btnS, fontSize: 13, padding: "6px 14px", marginBottom: 12, fontFamily: "sans-serif" }}>← Back to history</button>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>🗺️ {viewingTrip.start} → {viewingTrip.end}</h1>
          <p style={{ fontSize: 14, color: gray, marginTop: 4, fontFamily: "sans-serif" }}>Saved on {viewingTrip.date}{viewingTrip.depart ? ` · Departing ${viewingTrip.depart}` : ""}</p>
        </div>
        {days.map((day, i) => (
          <div key={i} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: "0.6rem" }}>{day.title}</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, fontFamily: "sans-serif" }}>
              {day.lines.map((line, j) => <div key={j} dangerouslySetInnerHTML={{ __html: formatLine(line) }} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (showHistory) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "sans-serif", padding: "0 0 2rem" }}>
        <div style={{ padding: "1.5rem 0 1rem", borderBottom: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
          <button onClick={() => setShowHistory(false)} style={{ ...btnS, fontSize: 13, padding: "6px 14px", marginBottom: 12 }}>← Back</button>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>🗺️ My Saved Trips</h1>
          <p style={{ fontSize: 14, color: gray, marginTop: 4 }}>Your recent road trip itineraries</p>
        </div>
        {tripHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: gray }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚗</div>
            <p>No saved trips yet — plan your first one!</p>
            <button style={{ ...btnP, marginTop: 16 }} onClick={() => setShowHistory(false)}>Plan a trip</button>
          </div>
        )}
        {tripHistory.map(trip => (
          <div key={trip.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div onClick={() => setViewingTrip(trip)} style={{ cursor: "pointer", flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{trip.start} → {trip.end}</div>
              <div style={{ fontSize: 12, color: gray, marginTop: 4, display: "flex", gap: 10 }}>
                <span>📅 {trip.date}</span>
                {trip.vehicle && <span>🚗 {trip.vehicle}</span>}
                {trip.withKids ? <span>👨‍👩‍👧‍👦 With kids</span> : <span>🧑‍🤝‍🧑 Adults</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
              <button onClick={() => setViewingTrip(trip)} style={{ ...btnP, fontSize: 12, padding: "6px 14px" }}>View</button>
              <button onClick={() => deleteTrip(trip.id)} style={{ ...btnS, fontSize: 12, padding: "6px 14px", color: "#dc2626", borderColor: "#fca5a5" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "sans-serif", padding: "0 0 2rem" }}>
      <div style={{ padding: "1.5rem 0 1rem", borderBottom: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>Road Trip Planner</h1>
            <p style={{ fontSize: 14, color: gray, marginTop: 4 }}>Tell us about your trip and we'll build the perfect itinerary</p>
          </div>
          {tripHistory.length > 0 && (
            <button onClick={() => setShowHistory(true)} style={{ ...btnS, fontSize: 12, padding: "6px 14px", whiteSpace: "nowrap" }}>
              🗺️ My trips ({tripHistory.length})
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: "sans-serif", background: i < step ? green : i === step ? blue : "#e5e7eb", color: i <= step ? "white" : "#9ca3af", transition: "all 0.3s", flexShrink: 0 }}>{i < step ? "✓" : i + 1}</div>
              <div style={{ fontSize: 10, color: i === step ? blue : i < step ? green : "#9ca3af", fontFamily: "sans-serif", whiteSpace: "nowrap", fontWeight: i === step ? 600 : 400 }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? green : "#e5e7eb", margin: "0 6px", marginBottom: 16, transition: "background 0.3s" }} />
            )}
          </div>
        ))}
      </div>

      {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "0.75rem 1rem", fontSize: 13, color: "#991b1b", marginBottom: 16 }}>{error}</div>}

      {step === 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <Field label="Starting city" required><input style={inputStyle} value={form.start} onChange={e => upd("start", e.target.value)} placeholder="e.g. Phoenix, AZ" /></Field>
            <Field label="Destination" required><input style={inputStyle} value={form.end} onChange={e => upd("end", e.target.value)} placeholder="e.g. Grand Canyon Village" /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <Field label="Departure date"><input style={inputStyle} type="date" value={form.depart} onChange={e => upd("depart", e.target.value)} /></Field>
            <Field label="Must arrive by (optional)"><input style={inputStyle} type="date" value={form.arrive} onChange={e => upd("arrive", e.target.value)} /></Field>
            <Field label="Return date (optional)"><input style={inputStyle} type="date" value={form.ret} onChange={e => upd("ret", e.target.value)} /></Field>
          </div>
          <Field label="Must-see stops or detours?"><input style={inputStyle} value={form.stops} onChange={e => upd("stops", e.target.value)} placeholder="e.g. Sedona, Meteor Crater" /></Field>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: -8, fontFamily: "sans-serif" }}><span style={{ color: "#dc2626" }}>*</span> Required fields</p>
          <Field label="Vehicle type">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 }}>
              {[
                {v:"motorcycle", icon:"🏍️", l:"Motorcycle"},
                {v:"2WD", icon:"🚗", l:"Car / 2WD"},
                {v:"AWD/4WD", icon:"🚙", l:"SUV / AWD"},
                {v:"electric vehicle", icon:"⚡", l:"Electric"},
                {v:"RV or camper van", icon:"🚐", l:"RV / Van"},
                {v:"truck", icon:"🛻", l:"Truck"},
              ].map(({v, icon, l}) => (
                <button key={v} onClick={() => upd("vehicle", form.vehicle === v ? "" : v)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 8px", border: form.vehicle === v ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: form.vehicle === v ? "#dbeafe" : "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: form.vehicle === v ? "#1e40af" : "#374151", fontWeight: form.vehicle === v ? 600 : 400 }}>{l}</span>
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div>
          <Field label="Who's coming?">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                {label: "Traveling with kids", icon: "👨‍👩‍👧‍👦", val: true},
                {label: "Adults only", icon: "🧑‍🤝‍🧑", val: false},
              ].map(({label, icon, val}) => (
                <button key={label} onClick={() => upd("withKids", val)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "16px 8px", border: form.withKids === val ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: form.withKids === val ? "#dbeafe" : "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: form.withKids === val ? "#1e40af" : "#374151", fontWeight: form.withKids === val ? 600 : 400 }}>{label}</span>
                </button>
              ))}
            </div>
          </Field>
          {form.withKids && (
            <Field label="Kids' ages">
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, width: 100 }} type="number" value={kidInput} onChange={e => setKidInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addKid()} placeholder="Age" min="0" max="17" />
                <button style={btnP} onClick={addKid}>Add kid</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {form.kids.map((age, i) => (
                  <span key={i} style={{ background: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7", borderRadius: 20, fontSize: 13, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Age {age} <button onClick={() => upd("kids", form.kids.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#065f46", fontSize: 14, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            </Field>
          )}
          <Field label="Number of travelers">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button style={{ ...btnS, padding: "4px 14px", fontSize: 18 }} onClick={() => upd("adults", Math.max(1, form.adults - 1))}>−</button>
              <span style={{ fontSize: 16, fontWeight: 600, minWidth: 24, textAlign: "center" }}>{form.adults}</span>
              <button style={{ ...btnS, padding: "4px 14px", fontSize: 18 }} onClick={() => upd("adults", Math.min(10, form.adults + 1))}>+</button>
              <span style={{ fontSize: 13, color: gray }}>adult{form.adults !== 1 ? "s" : ""}</span>
            </div>
          </Field>
          <Field label={`Normal driving day: ${form.driveNormal} hrs`}>
            <input type="range" min="2" max="7" step="0.5" value={form.driveNormal} onChange={e => upd("driveNormal", parseFloat(e.target.value))} style={{ width: "100%" }} />
          </Field>
          <Field label={`Maximum push day: ${form.driveMax} hrs`}>
            <input type="range" min="4" max="12" step="0.5" value={form.driveMax} onChange={e => upd("driveMax", parseFloat(e.target.value))} style={{ width: "100%" }} />
          </Field>
          <Field label="Travel considerations">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
              {(form.withKids
                ? [{v:"motion sickness", icon:"🤢"},{v:"frequent bathroom breaks", icon:"🚻"},{v:"restless kids", icon:"😤"},{v:"baby or toddler", icon:"👶"},{v:"traveling with a pet", icon:"🐾"},{v:"allergies or medical needs", icon:"💊"}]
                : [{v:"traveling with a pet", icon:"🐾"},{v:"mobility considerations", icon:"♿"},{v:"prefer avoiding highways", icon:"🛣️"},{v:"large group", icon:"👥"},{v:"first time on this route", icon:"🗺️"},{v:"allergies or medical needs", icon:"💊"}]
              ).map(({v, icon}) => (
                <button key={v} onClick={() => toggleArr("considerations", v)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 8px", border: form.considerations.includes(v) ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: form.considerations.includes(v) ? "#dbeafe" : "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: form.considerations.includes(v) ? "#1e40af" : "#374151", fontWeight: form.considerations.includes(v) ? 600 : 400, lineHeight: 1.3 }}>{v}</span>
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div>
          <Field label="Where do you want to sleep?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
              {[
                {v:"🏕️ Tent camping", icon:"🏕️", l:"Tent Camping"},
                {v:"🚐 RV / camper hookups", icon:"🚐", l:"RV / Camper"},
                {v:"✨ Glamping", icon:"✨", l:"Glamping"},
                {v:"🏨 Mix of camping & hotels", icon:"🔀", l:"Mix It Up"},
                {v:"🏨 Hotel / Motel - No Preference", icon:"🏨", l:"Any Hotel"},
                {v:"Marriott", icon:"⭐", l:"Marriott"},
                {v:"Hilton", icon:"⭐", l:"Hilton"},
                {v:"Hyatt", icon:"⭐", l:"Hyatt"},
                {v:"IHG / Holiday Inn", icon:"⭐", l:"IHG / Holiday Inn"},
                {v:"Best Western", icon:"⭐", l:"Best Western"},
                {v:"Hampton Inn", icon:"⭐", l:"Hampton Inn"},
                {v:"Must have pool", icon:"🏊", l:"Must Have Pool"},
                {v:"Pet-friendly", icon:"🐾", l:"Pet Friendly"},
              ].map(({v, icon, l}) => (
                <button key={v} onClick={() => toggleArr("accommodation", v)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 8px", border: form.accommodation.includes(v) ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: form.accommodation.includes(v) ? "#dbeafe" : "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: form.accommodation.includes(v) ? "#1e40af" : "#374151", fontWeight: form.accommodation.includes(v) ? 600 : 400, lineHeight: 1.3 }}>{l}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Food preferences">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
              {[
                {v:"Local restaurants & diners", icon:"🍴", l:"Local Spots"},
                {v:"Any fast food", icon:"🍔", l:"Fast Food"},
                {v:"Packed lunches from a cooler", icon:"🧺", l:"Packed Lunches"},
                {v:"Sit-down dinners", icon:"🍽️", l:"Sit-Down Dinners"},
                {v:"Wineries & breweries", icon:"🍷", l:"Wineries & Breweries"},
                {v:"Subway", icon:"🥖", l:"Subway"},
                {v:"McDonald's", icon:"🍟", l:"McDonald's"},
                {v:"Chick-fil-A", icon:"🐔", l:"Chick-fil-A"},
                {v:"Cracker Barrel", icon:"🪑", l:"Cracker Barrel"},
                {v:"Panera", icon:"🥐", l:"Panera"},
              ].map(({v, icon, l}) => (
                <button key={v} onClick={() => toggleArr("food", v)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 8px", border: form.food.includes(v) ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: form.food.includes(v) ? "#dbeafe" : "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: form.food.includes(v) ? "#1e40af" : "#374151", fontWeight: form.food.includes(v) ? 600 : 400, lineHeight: 1.3 }}>{l}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, fontFamily: "sans-serif" }}>US chains listed — select what applies to your region</p>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Breakfast"><select style={inputStyle} value={form.breakfast} onChange={e => upd("breakfast", e.target.value)}>{["7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM"].map(t => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Lunch"><select style={inputStyle} value={form.lunch} onChange={e => upd("lunch", e.target.value)}>{["11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM"].map(t => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Dinner"><select style={inputStyle} value={form.dinner} onChange={e => upd("dinner", e.target.value)}>{["5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM"].map(t => <option key={t}>{t}</option>)}</select></Field>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <Field label={form.withKids ? "What does your group love?" : "What are you into?"}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
              {[
                {v:"Hiking & outdoors", icon:"🥾"},
                {v:"National parks", icon:"🏔️"},
                {v:"History & museums", icon:"🏛️"},
                {v:"Quirky roadside stops", icon:"🛸"},
                {v:"Wildlife & zoos", icon:"🦁"},
                {v:"Science & space", icon:"🔭"},
                {v:"Photography & scenic views", icon:"📸"},
                {v:"Off-roading & adventure", icon:"🤠"},
                ...(form.withKids
                  ? [{v:"Dinosaurs & fossils", icon:"🦕"},{v:"Water parks", icon:"💦"}]
                  : [{v:"Wineries & breweries", icon:"🍷"},{v:"Live music & nightlife", icon:"🎵"},{v:"Fine dining", icon:"🍾"},{v:"Spa & wellness", icon:"🧖"}]
                )
              ].map(({v, icon}) => (
                <button key={v} onClick={() => toggleArr("interests", v)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 8px", border: form.interests.includes(v) ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: form.interests.includes(v) ? "#dbeafe" : "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: form.interests.includes(v) ? "#1e40af" : "#374151", fontWeight: form.interests.includes(v) ? 600 : 400, lineHeight: 1.3 }}>{v}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Budget vibe">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                {v:"budget-friendly", icon:"💰", l:"Budget Friendly"},
                {v:"moderate", icon:"💳", l:"Moderate"},
                {v:"splurge-worthy", icon:"✨", l:"Splurge Worthy"},
              ].map(({v, icon, l}) => (
                <button key={v} onClick={() => upd("budget", v)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "14px 8px", border: form.budget === v ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, background: form.budget === v ? "#dbeafe" : "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: form.budget === v ? "#1e40af" : "#374151", fontWeight: form.budget === v ? 600 : 400 }}>{l}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Anything else?">
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.extra} onChange={e => upd("extra", e.target.value)} placeholder="dietary needs, allergies, special occasions, things to avoid..." />
          </Field>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {step > 0 && <button style={btnS} onClick={() => setStep(s => s - 1)}>← Back</button>}
          <button onClick={saveDraft} style={{ ...btnS, fontSize: 12, padding: "7px 14px", color: draftSaved ? green : gray, borderColor: draftSaved ? green : "#d1d5db" }}>
            {draftSaved ? "✓ Saved!" : "💾 Save draft"}
          </button>
        </div>
        {step < 3
          ? <button style={btnP} onClick={() => setStep(s => s + 1)}>Next →</button>
          : <button style={btnG} onClick={generate}>Build my trip plan ↗</button>
        }
      </div>
    </div>
  );
}
