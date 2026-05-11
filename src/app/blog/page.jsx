import Link from "next/link";

export const metadata = {
  title: "Road Trip Travel Guides — Our Road Trip Planner",
  description: "Free road trip guides for families, solo travelers, and adventure seekers. Day-by-day itineraries, tips, and inspiration for your next great road trip.",
};

const posts = [
  {
    slug: "chicago-to-mt-rushmore",
    title: "Chicago to Mount Rushmore Road Trip: The Ultimate Family Guide",
    description: "Drive through the heart of America from Chicago to Mount Rushmore — past the Badlands, Wall Drug, and Custer State Park's bison herds.",
    date: "May 2026",
    readTime: "10 min read",
    tags: ["Midwest", "Family Travel", "South Dakota"],
  },
  {
    slug: "oregon-coast-highway-101",
    title: "Oregon Coast Road Trip: The Complete Highway 101 Guide",
    description: "Drive Oregon's Highway 101 from Portland to the California border through sea stacks, rainforests, fishing towns, and some of the most dramatic viewpoints in North America.",
    date: "May 2026",
    readTime: "10 min read",
    tags: ["Pacific Northwest", "Oregon", "Scenic Drive"],
  },
  {
    slug: "new-england-fall-foliage-road-trip",
    title: "New England Fall Foliage Road Trip: The Complete Loop Guide",
    description: "The ultimate guide to driving Vermont, New Hampshire, and Maine during peak foliage — with timing tips, covered bridges, and the best stops along the way.",
    date: "May 2026",
    readTime: "11 min read",
    tags: ["Northeast", "Fall Travel", "Vermont"],
  },
  {
    slug: "scottish-highlands-road-trip",
    title: "Scottish Highlands Road Trip: The Ultimate Self-Drive Guide",
    description: "Drive the North Coast 500, explore the Isle of Skye, and navigate single-track roads through one of the last truly wild places in Europe.",
    date: "May 2026",
    readTime: "12 min read",
    tags: ["Europe", "Scotland", "NC500"],
  },
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
    tags: ["Southwest", "Family Travel", "National Parks"],
  },
];

export default function BlogIndex() {
  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "sans-serif" }}>
      <div style={{ background: "#1F1F1F", borderBottom: "3px solid #D85A30", padding: "1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Our Road Trip Planner</div>
            <div style={{ color: "#D85A30", fontSize: 10, letterSpacing: "0.15em" }}>EVERY ROAD · YOUR WAY</div>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#7BAFD4", textDecoration: "none" }}>Plan a trip ↗</Link>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginBottom: 8 }}>Road Trip Guides</h1>
        <p style={{ fontSize: 15, color: "#6b7280", marginBottom: "2rem" }}>Free guides for every kind of road trip — family adventures, scenic drives, and everything in between.</p>

        <div style={{ display: "grid", gap: 16 }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 1.5rem", transition: "border-color 0.15s" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", margin: "0 0 8px", lineHeight: 1.4 }}>{post.title}</h2>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 10px", lineHeight: 1.6 }}>{post.description}</p>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9ca3af" }}>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ background: "#1F1F1F", borderRadius: 12, padding: "1.5rem", marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", margin: "0 0 8px" }}>Ready to plan your own road trip?</p>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 16px" }}>Our free AI planner builds a custom day-by-day itinerary based on your crew, driving limits, and interests.</p>
          <Link href="/" style={{ display: "inline-block", background: "#D85A30", color: "white", textDecoration: "none", padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
            Plan My Trip — Free ↗
          </Link>
        </div>
      </div>

      <div style={{ background: "#1F1F1F", borderTop: "3px solid #D85A30", padding: "1rem", textAlign: "center", marginTop: "2rem" }}>
        <div style={{ fontSize: 11, color: "#5F5E5A" }}>
          © 2026 Our Road Trip Planner™ · <Link href="/terms" style={{ color: "#5F5E5A" }}>Terms</Link> · <Link href="/privacy" style={{ color: "#5F5E5A" }}>Privacy</Link>
        </div>
      </div>
    </main>
  );
}
