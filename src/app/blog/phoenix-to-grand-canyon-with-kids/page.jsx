import Link from "next/link";

export const metadata = {
  title: "Road Trip from Phoenix to Grand Canyon with Kids: The Complete Family Guide",
  description: "Planning a family road trip from Phoenix to the Grand Canyon? Here's everything you need to know — best stops, what to expect, and a recommended 2-day itinerary.",
};

export default function Post1() {
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
          {["Family Travel", "Arizona", "Grand Canyon"].map(tag => (
            <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", lineHeight: 1.3, marginBottom: 12 }}>Road Trip from Phoenix to Grand Canyon with Kids: The Complete Family Guide</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "2rem" }}>May 2026 · 8 min read</p>

        <div style={{ fontSize: 16, lineHeight: 1.9, color: "#374151" }}>
          <p><em>Planning a family road trip from Phoenix to the Grand Canyon? Here's everything you need to know — including how to plan it in minutes with an AI road trip planner built for families.</em></p>

          <p>The drive from Phoenix to the Grand Canyon is one of the most iconic road trips in America. It's also one of the most rewarding to do with kids — if you plan it right. We're talking towering red rocks, quirky roadside stops, the most jaw-dropping view in North America, and just enough driving to feel like an adventure without turning the back seat into a war zone.</p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: 12 }}>The Drive: What to Expect</h2>
          <p>The most direct route from Phoenix to Grand Canyon Village is about 230 miles and takes roughly 3.5 to 4 hours without stops. Most families take the I-17 North through Flagstaff, then US-180 or AZ-64 up to the South Rim. But here's the thing — the drive itself is half the fun if you stop at the right places.</p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: 12 }}>Best Stops Between Phoenix and the Grand Canyon</h2>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginTop: "1.5rem", marginBottom: 8 }}>1. Sedona (about 2 hours from Phoenix)</h3>
          <p>Sedona is worth a stop even if just for lunch. The red rock formations are genuinely stunning, and kids love the dramatic landscape. If you have energy, the Airport Mesa trail is short, easy, and has incredible views.</p>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginTop: "1.5rem", marginBottom: 8 }}>2. Montezuma Castle National Monument</h3>
          <p>Just off I-17, this cliff dwelling is one of the best-preserved ancient Native American sites in North America. It's a short walk from the parking lot and genuinely impressive. Kids aged 8+ tend to love it — it sparks real curiosity. Admission: $10/adult, free under 16.</p>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginTop: "1.5rem", marginBottom: 8 }}>3. Meteor Crater</h3>
          <p>About 45 minutes east of Flagstaff on I-40, Meteor Crater is exactly what it sounds like — the best-preserved meteorite impact crater on Earth. Science-loving kids will be obsessed. Even reluctant ones tend to come around once they understand a rock from space created a hole nearly a mile wide.</p>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginTop: "1.5rem", marginBottom: 8 }}>4. Flagstaff</h3>
          <p>Flagstaff makes a great overnight stop if you're splitting the trip into two days — which we highly recommend with kids. Downtown Flagstaff is charming, walkable, and has great food options. The drive from Flagstaff to the Grand Canyon is only about 80 miles — a quick, easy morning drive.</p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: 12 }}>The Grand Canyon with Kids: What You Need to Know</h2>
          <p><strong>South Rim vs. North Rim:</strong> The South Rim is the right choice for families. It's open year-round, has the most facilities, and is the most accessible.</p>
          <p style={{ marginTop: 12 }}><strong>Best viewpoints for kids:</strong> Mather Point, Bright Angel Trailhead, and Desert View Watchtower are all excellent and accessible for all ages.</p>
          <p style={{ marginTop: 12 }}><strong>Junior Ranger Program:</strong> Pick up a Junior Ranger booklet at the visitor center. Kids complete activities and earn a badge. It's free and keeps kids engaged throughout the visit.</p>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: 12 }}>Recommended 2-Day Itinerary</h2>

          <div style={{ background: "#f0f7ff", borderLeft: "4px solid #2563eb", padding: "1rem 1.25rem", borderRadius: "0 8px 8px 0", marginBottom: 16 }}>
            <strong>Day 1: Phoenix → Flagstaff</strong><br />
            8:00 AM Depart Phoenix · 10:00 AM Montezuma Castle · 12:00 PM Lunch in Sedona · 4:30 PM Arrive Flagstaff · 6:30 PM Dinner downtown
          </div>
          <div style={{ background: "#f0fdf4", borderLeft: "4px solid #059669", padding: "1rem 1.25rem", borderRadius: "0 8px 8px 0", marginBottom: 16 }}>
            <strong>Day 2: Flagstaff → Grand Canyon → Phoenix</strong><br />
            7:30 AM Depart Flagstaff · 9:00 AM Arrive South Rim · 12:00 PM Lunch at Bright Angel Lodge · 1:30 PM Desert View Watchtower · 3:00 PM Depart for Phoenix
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: 12 }}>What to Pack</h2>
          <p>Reusable water bottles, sunscreen and hats, snacks for the car, layers (even in summer the canyon rim can be 20°F cooler than Phoenix), and download offline maps before you go — cell service is spotty north of Flagstaff.</p>
        </div>

        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "#1e3a5f", borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "white", fontFamily: "Georgia, serif", marginBottom: 8 }}>Plan this trip in 2 minutes</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Our AI planner builds a personalized Phoenix to Grand Canyon itinerary based on your driving limits, kids' ages, and hotel preferences.</p>
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
