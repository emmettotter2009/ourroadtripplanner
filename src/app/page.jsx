"use client";
import RoadTripPlanner from "../components/RoadTripPlanner";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header with logo */}
      <div style={{ background: "#2C2C2A", padding: "0.75rem 1rem", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "3px solid #D85A30" }}>
        <img
          src="/icon-512.png"
          alt="Our Road Trip Planner"
          style={{ height: 52, width: 52, borderRadius: 8, marginRight: 14 }}
        />
        <div>
          <div style={{ color: "#F5F5F0", fontSize: 20, fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}>
            Our Road Trip Planner
          </div>
          <div style={{ color: "#D85A30", fontSize: 11, fontFamily: "Georgia, serif", letterSpacing: "0.15em" }}>
            EVERY ROAD · YOUR WAY
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
        <RoadTripPlanner />
      </div>

      {/* Site footer */}
      <div style={{ background: "#2C2C2A", borderTop: "3px solid #D85A30", padding: "1.25rem 1rem", textAlign: "center", fontFamily: "sans-serif" }}>
        <img src="/icon-512.png" alt="logo" style={{ height: 36, width: 36, borderRadius: 6, marginBottom: 8 }} />
        <div style={{ fontSize: 12, color: "#888780", marginTop: 4 }}>
          © 2026 Our Road Trip Planner™ &nbsp;·&nbsp;
          <a href="/terms" style={{ color: "#888780", textDecoration: "none" }}>Terms</a> &nbsp;·&nbsp;
          <a href="/privacy" style={{ color: "#888780", textDecoration: "none" }}>Privacy</a> &nbsp;·&nbsp;
          <a href="/affiliate-disclosure" style={{ color: "#888780", textDecoration: "none" }}>Affiliate Disclosure</a>
        </div>
        <div style={{ fontSize: 11, color: "#5F5E5A", marginTop: 6 }}>
          AI-generated itineraries for planning purposes only. Always verify conditions before travel.
        </div>
      </div>
    </main>
  );
}
