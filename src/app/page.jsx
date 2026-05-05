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

      {/* Hero header with photo */}
      <div style={{ position: "relative", borderBottom: "3px solid #D85A30", overflow: "hidden", minHeight: 220 }}>
        {/* Photo background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }} />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.54)" }} />
        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "1.5rem 1rem", gap: 10 }}>
          <img src="/icon-512.png" alt="Our Road Trip Planner" style={{ height: 56, width: 56, borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }} />
          <div style={{ color: "#F5F5F0", fontSize: 24, fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: "0.05em", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
            Our Road Trip Planner
          </div>
          <div style={{ color: "#D85A30", fontSize: 11, fontFamily: "Georgia, serif", letterSpacing: "0.18em" }}>
            EVERY ROAD · YOUR WAY
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontFamily: "sans-serif", marginTop: 4, maxWidth: 400 }}>
            AI-powered itineraries built around your family's real needs
          </div>
        </div>
      </div>

      {/* First-visit privacy notice */}
      {showNotice && (
        <div style={{ background: "#F0FDF4", padding: "0.6rem 1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", fontFamily: "sans-serif", borderBottom: "1px solid #BBF7D0" }}>
          <span style={{ fontSize: 12, color: "#166534" }}>
            🔒 This site uses local browser storage to save your trip drafts — no cookies, no tracking, no personal data stored on our servers.
          </span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/privacy" style={{ fontSize: 12, color: "#16A34A", textDecoration: "underline" }}>Learn more</a>
            <button onClick={dismissNotice} style={{ fontSize: 12, color: "#166534", background: "rgba(0,0,0,0.08)", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}>
              Got it ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
        <RoadTripPlanner />
      </div>

      {/* Footer */}
      <div style={{ background: "#1F1F1F", borderTop: "3px solid #D85A30", padding: "1.25rem 1rem", textAlign: "center", fontFamily: "sans-serif" }}>
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
        <div style={{ fontSize: 10, color: "#3a3a38", marginTop: 8 }}>
          Header photo by Harley-Davidson via Unsplash
        </div>
      </div>
    </main>
  );
}
