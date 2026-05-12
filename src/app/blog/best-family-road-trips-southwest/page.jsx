import Link from "next/link";

export const metadata = {
  title: "The 7 Best Family Road Trips in the American Southwest",
  description: "Big landscapes, endless adventure, and enough roadside weirdness to keep kids entertained for days. The best Southwest road trips for families.",
};

export default function Post3() {
  const trips = [
    { num: 1, title: "Phoenix to Grand Canyon (Arizona)", details: "230 miles · 2-3 days · All ages", color: "#2563eb", desc: "The classic. The South Rim is genuinely one of the most awe-inspiring places on Earth, and the drive through Sedona and Flagstaff is beautiful in its own right.", tip: "Split into two days with a night in Flagstaff. The drive from Flagstaff to the canyon is only 80 miles — a perfect easy morning." },
    { num: 2, title: "Las Vegas to Zion & Bryce Canyon (Utah)", details: "270 miles round trip · 3-4 days · Kids 6+", color: "#059669", desc: "Arguably the most spectacular road trip in the country. Zion's towering sandstone cliffs and Bryce Canyon's otherworldly hoodoos are unlike anything else on earth.", tip: "Stay in Springdale outside Zion rather than driving in. The free shuttle system makes it easy to get around." },
    { num: 3, title: "Albuquerque to Santa Fe to Taos (New Mexico)", details: "130 miles · 3-4 days · Kids 8+", color: "#7c3aed", desc: "A cultural road trip unlike anything else. Adobe architecture, Native American history, incredible food, and art everywhere. Meow Wolf in Santa Fe is a must.", tip: "Time your visit for the Albuquerque International Balloon Fiesta in October — watching hundreds of hot air balloons launch at sunrise is unforgettable." },
    { num: 4, title: "Phoenix to Tucson to Tombstone (Arizona)", details: "180 miles · 2-3 days · Kids 7+", color: "#d97706", desc: "The Arizona-Sonora Desert Museum is one of the best wildlife experiences in the country. Tombstone's gunfight reenactments are cheesy but kids love it.", tip: "Budget a full half-day for the Desert Museum — it's part zoo, part botanical garden, part natural history museum." },
    { num: 5, title: "Los Angeles to Joshua Tree to Palm Springs (California)", details: "150 miles · 2-3 days · Kids 6+", color: "#dc2626", desc: "Joshua Tree is one of the most visually distinctive landscapes in America — a surreal forest of twisted trees and giant boulders that looks like Dr. Seuss designed it.", tip: "Visit in spring or fall — summer temperatures can exceed 110°F." },
    { num: 6, title: "Salt Lake City to Moab (Utah)", details: "235 miles · 3-4 days · Kids 8+", color: "#0891b2", desc: "Moab is the adventure capital of the Southwest. Arches National Park, Canyonlands, river rafting — the options are almost overwhelming.", tip: "Book activities in advance. Moab is extremely popular and river rafting, jeep tours fill up fast in summer." },
    { num: 7, title: "Las Vegas to Death Valley to Mammoth Lakes", details: "400 miles · 4-5 days · Kids 10+", color: "#65a30d", desc: "The epic route — Death Valley is strangely beautiful and the drive over the Sierra Nevada to Mammoth Lakes completes one of the most dramatic landscape transitions anywhere.", tip: "Only attempt Death Valley between October and April. Summer temperatures are not survivable without extreme preparation." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "sans-serif" }}>
      <div style={{ background: "#1F1F1F", borderBottom: "3px solid #D85A30", padding: "1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Our Road Trip Planner</div>
            <div style={{ color: "#D85A30", fontSize: 10, letterSpacing: "0.15em" }}>EVERY ROAD · YOUR WAY™</div>
          </Link>
          <Link href="/blog" style={{ fontSize: 13, color: "#7BAFD4", textDecoration: "none" }}>← All guides</Link>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1rem" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["Southwest", "Family Travel", "Road Trip Ideas"].map(tag => (
            <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", lineHeight: 1.3, marginBottom: 12 }}>The 7 Best Family Road Trips in the American Southwest</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "2rem" }}>May 2026 · 9 min read</p>

        <div style={{ fontSize: 16, lineHeight: 1.9, color: "#374151" }}>
          <p>The American Southwest was made for road trips. Wide open highways, dramatic scenery that changes every hundred miles, and a density of National Parks and natural wonders that's unmatched anywhere else in the country. Here are the seven best family road trips in the Southwest — ranked by how good they are for families specifically.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
          {trips.map(trip => (
            <div key={trip.num} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: trip.color, padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", fontFamily: "Georgia, serif" }}>{trip.num}. {trip.title}</div>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{trip.details}</div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 10 }}>{trip.desc}</p>
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#92400e" }}>
                  💡 <strong>Family tip:</strong> {trip.tip}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "#1e3a5f", borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "white", fontFamily: "Georgia, serif", marginBottom: 8 }}>Plan any of these trips in 2 minutes</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Our AI planner builds a personalized day-by-day itinerary based on your driving limits, kids' ages, and preferences.</p>
          <Link href="/" style={{ display: "inline-block", background: "#D85A30", color: "white", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Plan my road trip →
          </Link>
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb", fontSize: 12, color: "#9ca3af" }}>
          <Link href="/blog" style={{ color: "#2563eb", textDecoration: "none" }}>← Back to all guides</Link>
        </div>
      </article>

      <div style={{ background: "#1F1F1F", borderTop: "3px solid #D85A30", padding: "1rem", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#5F5E5A" }}>© 2026 Our Road Trip Planner™</div>
      </div>
    </main>
  );
}
