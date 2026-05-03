"use client";
import RoadTripPlanner from "../components/RoadTripPlanner";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <RoadTripPlanner />
      </div>
    </main>
  );
}
