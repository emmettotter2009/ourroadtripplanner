"use client";
import Link from "next/link";

export const metadata = {
  title: "Road Trip Travel Guides — Our Road Trip Planner",
  description: "Free road trip guides for families, solo travelers, and adults traveling with aging parents. Day-by-day itineraries, tips, and inspiration for your next adventure.",
};

const posts = [
  {
    slug: "phoenix-to-grand-canyon-with-kids",
    title: "Road Trip from Phoenix to Grand Canyon with Kids: The Complete Family Guide",
    description: "Planning a family road trip from Phoenix to the Grand Canyon? Here's everything you need to know — the best stops, what to expect, and a recommended 2-day itinerary.",
    date: "May 2026",
    readTime: "8 min read",
    tags: ["Family Travel", "Arizona", "Grand Canyon"],
  },
  {
    slug: "how-to-plan-a-road-trip-with-kids",
    title: "How to Plan a Road Trip with Kids (Without Losing Your Mind)",
    description: "A practical guide for families who love road trips but hate the planning part. Driving limits, stops, hotels, food, and everything in between.",
    date: "May 2026",
    readTime: "10 min read",
    tags: ["Family Travel", "Planning Tips", "Kids"],
  },
  {
    slug: "best-family-road-trips-southwest",
    title: "The 7 Best Family Road Trips in the American Southwest",
    description: "Big landscapes, endless adventure, and enough roadside weirdness to keep kids entertained for days. The Southwest is the ultimate road trip destination for families.",
    date: "May 2026",
    readTime: "9 min read",
    tags: ["Southwest", "Family Travel", "Road Trip Ideas"],
  },
];

export default function Blog() {
  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1F1F1F", borderBottom: "3px solid #D85A30", padding: "1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Our Road Trip Planner</div>
            <div style={{ color: "#D85A30", fontSize: 10, letterSpacing: "0.15em" }}>EVERY ROAD · YOUR WAY</div>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#7BAFD4", textDecoration: "none", background: "rgba(255,255,255,0.1)", padding: "6px 14px", borderRadius: 8 }}>
            ← Plan a trip
          </Link>
        </div>
      </div>

      {/* Blog index */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginBottom: 8 }}>Road Trip Travel Guides</h1>
        <p style={{ fontSize: 15, color: "#6b7280", marginBottom: "2.5rem", lineHeight: 1.6 }}>
          Free guides for families, solo travelers, and adults traveling with aging parents. Real advice for real road trips.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.5rem", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#D85A30"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h2>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 12 }}>{post.description}</p>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{post.date} · {post.readTime}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "#1e3a5f", borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "white", fontFamily: "Georgia, serif", marginBottom: 8 }}>Ready to plan your trip?</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>Let our AI build a personalized day-by-day itinerary based on your real needs.</p>
          <Link href="/" style={{ display: "inline-block", background: "#D85A30", color: "white", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Plan my road trip →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#1F1F1F", borderTop: "3px solid #D85A30", padding: "1rem", textAlign: "center", marginTop: "2rem" }}>
        <div style={{ fontSize: 11, color: "#5F5E5A" }}>
          © 2026 Our Road Trip Planner™ · <Link href="/terms" style={{ color: "#5F5E5A" }}>Terms</Link> · <Link href="/privacy" style={{ color: "#5F5E5A" }}>Privacy</Link>
        </div>
      </div>
    </main>
  );
}
