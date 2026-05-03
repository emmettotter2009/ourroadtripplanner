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

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", padding: "8px 10px", fontSize: 14,
  border: "1px solid #d1d5db", borderRadius: 8,
  fontFamily: "inherit", color: "#111", outline: "none", boxSizing: "border-box",
};

const DRAFT_KEY = "roadtrip_draft";

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
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm(JSON.parse(saved));
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

Use real town names and businesses. Start directly with Day 1.`;
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

  const parseDays = (text) => {
    const days = []; const lines = text.split("\n"); let cur = null;
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      if (/^(#{1,3}\s*)?(Day\s+\d+)/i.test(t)) {
        if (cur) days.push(cur);
        cur = { title: t.replace(/^#+\s*/, "").replace(/\*\*/g, ""), lines: [] };
      } else if (cur) cur.lines.push(t);
    }
    if (cur) days.push(cur);
    return days.length ? days : [{ title: "Your Itinerary", lines: text.split("\n").filter(Boolean) }];
  };

  const formatLine = (line) => line
    .replace(/\*\*([^*]+)\*\*/g, (_, m) => `<strong>${m}</strong>`)
    .replace(/^[-•]\s*/, "• ");

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

  if (itinerary) {
    const days = parseDays(itinerary);
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "Georgia, serif", padding: "0 0 2rem" }}>
        <div style={{ padding: "1.5rem 0 1rem", borderBottom: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>🗺️ Your Road Trip Itinerary</h1>
          <p style={{ fontSize: 14, color: gray, marginTop: 4, fontFamily: "sans-serif" }}>{form.start} → {form.end}{form.depart ? ` · Departing ${form.depart}` : ""}</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap", fontFamily: "sans-serif" }}>
          <button onClick={() => setShowEmailForm(v => !v)} style={{ ...btnS, fontSize: 13, padding: "7px 16px" }}>📧 Email my itinerary</button>
          {emailSent && <span style={{ fontSize: 13, color: green, alignSelf: "center" }}>✓ Sent to your inbox!</span>}
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

        {days.map((day, i) => (
          <div key={i} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: "0.6rem", fontFamily: "Georgia, serif" }}>{day.title}</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, fontFamily: "sans-serif" }}>
              {day.lines.map((line, j) => <div key={j} dangerouslySetInnerHTML={{ __html: formatLine(line) }} />)}
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem", marginTop: "0.5rem", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: 13, color: gray, fontFamily: "sans-serif", marginBottom: "1rem" }}>✨ Bonus features:</p>
          <BonusPanel title="Historical Markers Along the Way" emoji="🏛️" content={markers} loading={markersLoading} onFetch={fetchMarkers} accentColor="#7c3aed" bgColor="#f5f3ff" />
          <BonusPanel title="Scenic Route Alternatives" emoji="🏞️" content={scenic} loading={scenicLoading} onFetch={fetchScenic} accentColor="#059669" bgColor="#f0fdf4" />
        </div>

        <button style={btnS} onClick={() => { setItinerary(null); setStep(0); setMarkers(null); setScenic(null); setEmailSent(false); setShowEmailForm(false); clearDraft(); }}>← Plan a new trip</button>
      </div>
    );
  }

  if (loading) return (
    <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", padding: "4rem 1rem", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🚗</div>
      <div style={{ fontSize: 16, color: "#111", fontWeight: 600, marginBottom: 8 }}>Building your itinerary...</div>
      <div style={{ fontSize: 13, color: gray }}>This takes about 15–20 seconds</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "sans-serif", padding: "0 0 2rem" }}>
      <div style={{ padding: "1.5rem 0 1rem", borderBottom: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>Road Trip Planner</h1>
        <p style={{ fontSize: 14, color: gray, marginTop: 4 }}>Tell us about your trip and we'll build the perfect itinerary</p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem" }}>
        {STEPS.map((s, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? green : i === step ? blue : "#e5e7eb", transition: "background 0.3s" }} />)}
      </div>
      <div style={{ fontSize: 12, color: gray, marginBottom: "1.25rem" }}>Step {step + 1} of {STEPS.length}: <strong>{STEPS[step]}</strong></div>

      {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "0.75rem 1rem", fontSize: 13, color: "#991b1b", marginBottom: 16 }}>{error}</div>}

      {step === 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Starting city"><input style={inputStyle} value={form.start} onChange={e => upd("start", e.target.value)} placeholder="e.g. Phoenix, AZ" /></Field>
            <Field label="Destination"><input style={inputStyle} value={form.end} onChange={e => upd("end", e.target.value)} placeholder="e.g. Grand Canyon Village" /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Departure date"><input style={inputStyle} type="date" value={form.depart} onChange={e => upd("depart", e.target.value)} /></Field>
            <Field label="Must arrive by (optional)"><input style={inputStyle} type="date" value={form.arrive} onChange={e => upd("arrive", e.target.value)} /></Field>
            <Field label="Return date (optional)"><input style={inputStyle} type="date" value={form.ret} onChange={e => upd("ret", e.target.value)} /></Field>
          </div>
          <Field label="Must-see stops or detours?"><input style={inputStyle} value={form.stops} onChange={e => upd("stops", e.target.value)} placeholder="e.g. Sedona, Meteor Crater" /></Field>
          <Field label="Vehicle type">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{v:"motorcycle",l:"🏍️ Motorcycle"},{v:"2WD",l:"🚗 Car / 2WD"},{v:"AWD/4WD",l:"🚙 SUV / AWD / 4WD"},{v:"RV or camper van",l:"🚐 RV / Camper Van"},{v:"truck",l:"🛻 Truck"}].map(({v,l}) => (
                <Tag key={v} label={l} selected={form.vehicle === v} onClick={() => upd("vehicle", form.vehicle === v ? "" : v)} />
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div>
          <Field label="Who's coming?">
            <div style={{ display: "flex", gap: 8 }}>
              <Tag label="👨‍👩‍👧‍👦 Traveling with kids" selected={form.withKids} onClick={() => upd("withKids", true)} />
              <Tag label="🧑‍🤝‍🧑 Adults only" selected={!form.withKids} onClick={() => upd("withKids", false)} />
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(form.withKids
                ? ["motion sickness","frequent bathroom breaks","restless kids","baby or toddler","traveling with a pet"]
                : ["traveling with a pet","mobility considerations","prefer avoiding highways","large group","first time on this route"]
              ).map(v => <Tag key={v} label={v} selected={form.considerations.includes(v)} onClick={() => toggleArr("considerations", v)} />)}
            </div>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div>
          <Field label="Where do you want to sleep?">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["🏕️ Tent camping","🚐 RV / camper hookups","✨ Glamping","🏨 Mix of camping & hotels","Marriott","Hilton","Hyatt","IHG / Holiday Inn","Best Western","Hampton Inn","Must have pool","Pet-friendly","No preference"].map(v => (
                <Tag key={v} label={v} selected={form.accommodation.includes(v)} onClick={() => toggleArr("accommodation", v)} />
              ))}
            </div>
          </Field>
          <Field label="Food preferences">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["McDonald's","Chick-fil-A","Subway","Cracker Barrel","Panera","Any fast food","Local spots","Packed lunches","Sit-down dinners","Wineries & breweries"].map(v => (
                <Tag key={v} label={v} selected={form.food.includes(v)} onClick={() => toggleArr("food", v)} />
              ))}
            </div>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Hiking & outdoors","National parks","History & museums","Quirky roadside stops","Wildlife & zoos","Science & space","Photography & scenic views","Off-roading & adventure",
                ...(form.withKids ? ["Dinosaurs & fossils","Water parks"] : ["Wineries & breweries","Live music & nightlife","Fine dining","Spa & wellness"])
              ].map(v => <Tag key={v} label={v} selected={form.interests.includes(v)} onClick={() => toggleArr("interests", v)} />)}
            </div>
          </Field>
          <Field label="Budget vibe">
            <div style={{ display: "flex", gap: 8 }}>
              {["budget-friendly","moderate","splurge-worthy"].map(v => <Tag key={v} label={v} selected={form.budget === v} onClick={() => upd("budget", v)} />)}
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
