"use client";
import { useState, useEffect } from "react";
import RoadTripPlanner from "../components/RoadTripPlanner";

export default function Home() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("privacy_notice_dismissed");
      if (!dismissed) setShowNotice(true);
    } catch(e) {}
  }, []);

  const dismissNotice = () => {
    try { localStorage.setItem("privacy_notice_dismissed", "1"); } catch(e) {}
    setShowNotice(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb" }}>

      {/* Header with logo */}
      <div style={{ background: "#2C2C2A", padding: "0.75rem 1rem", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "3px solid #D85A30" }}>
        <img src="/icon-512.png" alt="Our Road Trip Planner" style={{ height: 52, width: 52, borderRadius: 8, marginRight: 14 }} />
        <div>
          <div style={{ color: "#F5F5F0", fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}>
            Our Road Trip Planner
          </div>
          <div style={{ color: "#D85A30", fontSize: 11, fontFamily: "Georgia, serif", letterSpacing: "0.15em" }}>
            EVERY ROAD · YOUR WAY
          </div>
        </div>
      </div>

      {/* First-visit privacy notice */}
      {showNotice && (
        <div style={{ background: "#1e3a5f", padding: "0.6rem 1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", fontFamily: "sans-serif" }}>
          <span style={{ fontSize: 12, color: "#B5D4F4" }}>
            🔒 This site uses local browser storage to save your trip drafts — no cookies, no tracking, no personal data stored on our servers.
          </span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/privacy" style={{ fontSize: 12, color: "#7BAFD4", textDecoration: "underline" }}>Learn more</a>
            <button
              onClick={dismissNotice}
              style={{ fontSize: 12, color: "#B5D4F4", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}
            >
              Got it ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
        <RoadTripPlanner />
      </div>

      {/* Site footer */}
      <div style={{ background: "#2C2C2A", borderTop: "3px solid #D85A30", padding: "1.25rem 1rem", textAlign: "center", fontFamily: "sans-serif" }}>
        <img src="/icon-512.png" alt="logo" style={{ height: 36, width: 36, borderRadius: 6, marginBottom: 8 }} />
        <div style={{ fontSize: 12, color: "#888780", marginTop: 4, lineHeight: 2 }}>
          © 2026 Our Road Trip Planner™ &nbsp;·&nbsp;
          <a href="/terms" style={{ color: "#888780", textDecoration: "none" }}>Terms</a> &nbsp;·&nbsp;
          <a href="/privacy" style={{ color: "#888780", textDecoration: "none" }}>Privacy</a> &nbsp;·&nbsp;
          <a href="/affiliate-disclosure" style={{ color: "#888780", textDecoration: "none" }}>Affiliate Disclosure</a> &nbsp;·&nbsp;
          <a href="/privacy" style={{ color: "#888780", textDecoration: "none" }}>Do Not Sell My Info</a>
        </div>
        <div style={{ fontSize: 11, color: "#5F5E5A", marginTop: 6 }}>
          AI-generated itineraries for planning purposes only. Always verify conditions before travel.
        </div>
        <div style={{ fontSize: 11, color: "#5F5E5A", marginTop: 4 }}>
          Trip drafts and history are saved locally in your browser — nothing is stored on our servers.
        </div>
      </div>
    </main>
  );
}
