import Link from "next/link";

export const metadata = {
  title: "New England Fall Foliage Road Trip: The Complete Loop Guide",
  description: "Plan the ultimate New England fall foliage road trip. Discover the best routes, peak timing, covered bridges, and charming towns across Vermont, New Hampshire, and Maine.",
};

export default function FallFoliage() {
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
          {["Northeast", "Fall Travel", "Vermont", "New England"].map(tag => (
            <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", lineHeight: 1.3, marginBottom: 12 }}>New England Fall Foliage Road Trip: The Complete Loop Guide</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "2rem" }}>May 2026 · 11 min read</p>

        <div style={{ fontSize: 16, lineHeight: 1.9, color: "#374151" }}>

          <p>Every autumn, New England puts on one of the greatest natural spectacles on earth. The forests turn from green to an almost impossibly vivid palette of red, orange, gold, and burgundy — and the roads that wind through Vermont's hills, New Hampshire's mountains, and Maine's lakes become some of the most beautiful drives in the world. People fly in from across the globe for this. If you live within driving distance and haven't done a fall foliage road trip, this is the year.</p>

          <p>The classic New England foliage loop starts and ends in Boston, runs north through Vermont, east across New Hampshire's White Mountains, and returns down the Maine coast. It's roughly 800 to 1,000 miles depending on your exact route and takes five to seven days to do properly. Every mile is worth it.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>When to Go: Timing is Everything</h2>

          <p>Peak foliage timing varies by latitude and elevation — northern Vermont and New Hampshire's higher elevations typically peak in late September to early October, while southern Vermont, Massachusetts, and coastal Maine peak in mid to late October. The sweet spot for the full loop is usually the first two weeks of October, which catches the tail end of the northern peak and the height of color further south.</p>

          <p>The foliage hotline is a real thing — Vermont's agency of commerce runs a weekly foliage report at foliage.vermont.gov, and New Hampshire has a similar report. Check both as your trip approaches and be prepared to adjust your itinerary based on where color is peaking.</p>

          <p>One important caveat: peak foliage weekend in Vermont is the single most booked weekend of the year. If you're going the first or second weekend of October, book accommodations months in advance. Midweek travel during foliage season is dramatically easier to book and only slightly less beautiful.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>The Route: Day by Day Highlights</h2>

          <p><strong>Day 1 — Boston to Stowe, VT (about 3.5 hours)</strong></p>
          <p>Head northwest from Boston on I-89 into Vermont. Stop in Montpelier — the smallest state capital in the country and genuinely charming — before continuing to Stowe, Vermont's premier mountain town. Stowe sits at the foot of Mount Mansfield, Vermont's highest peak, and the surrounding hills are absolutely incandescent in peak foliage. The Stowe Recreation Path winds through the valley and is one of the nicest easy walks in New England. Book dinner at one of the excellent farm-to-table restaurants that have made Vermont's food scene nationally recognized.</p>

          <p><strong>Day 2 — Stowe and the Mad River Valley</strong></p>
          <p>Take Route 100 south — consistently rated one of the most scenic roads in America in fall. This winding two-lane highway runs through the spine of Vermont past farms, covered bridges, and village greens that look like they were designed for a Norman Rockwell painting. Stop in Waitsfield and Warren in the Mad River Valley, both completely charming with local cafes and craft breweries. The covered bridges in this area are some of the most photogenic in New England.</p>

          <p><strong>Day 3 — Woodstock and Quechee Gorge (about 1.5 hours south)</strong></p>
          <p>Woodstock, Vermont is arguably the most picture-perfect village in New England — a manicured green surrounded by Federal-style homes and church steeples, with the Ottauquechee River running through it. A few miles east, Quechee Gorge is Vermont's "Little Grand Canyon" — a 165-foot-deep gorge that's easily viewed from a bridge on Route 4. Continue east into New Hampshire.</p>

          <p><strong>Day 4 — White Mountains, NH (about 2 hours from Woodstock)</strong></p>
          <p>New Hampshire's White Mountains are stunning in fall — and the Kancamagus Highway (Route 112) is one of the great scenic drives in America. This 34-mile road through the White Mountain National Forest has no commercial development, only pullouts and trailheads, and the foliage views in October are extraordinary. Stop at the numerous overlooks and the Swift River swimming holes if the day is warm enough. Stay in North Conway at the eastern end, a lively base camp with outlet shopping and easy access to the mountains.</p>

          <p><strong>Day 5 — Mount Washington and the Crawford Notch (about 1 hour)</strong></p>
          <p>If weather permits, drive the Mount Washington Auto Road — 7.6 miles of steep, narrow road to the summit of the highest peak in the Northeast. The summit regularly has the worst weather on earth, so call ahead (the road has a weather line) and go only if visibility is good. On a clear day, the views across the foliage-covered range are astonishing. Crawford Notch State Park to the west has beautiful hiking and the historic Crawford Notch train depot.</p>

          <p><strong>Day 6 — Portland, Maine and the Coast (about 2 hours)</strong></p>
          <p>Head east into Maine and down to Portland, one of the best food cities in America relative to its size. The Old Port district has excellent restaurants, independent shops, and a working waterfront. October is an ideal time to visit — lobster is still in season, the summer crowds are gone, and the light on the harbor is magnificent. Drive south along the Maine coast through Kennebunkport and York before crossing back into New Hampshire and Massachusetts.</p>

          <p><strong>Day 7 — Return to Boston (about 1.5 hours from Portland)</strong></p>
          <p>Take the scenic coastal route back through the North Shore towns of Rockport and Gloucester, both worth a stop for their harbors and seafood shacks, before returning to Boston.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Don't Miss Along the Way</h2>

          <p><strong>A Vermont country store.</strong> The Vermont Country Store in Weston is a genuine institution — three floors of hard-to-find Vermont products, penny candy, and a deli that makes exceptional sandwiches. It's a little touristy and completely worth it.</p>

          <p><strong>Fresh apple cider donuts.</strong> Every farm stand in Vermont and New Hampshire sells them in fall. They are not optional. Cold Hollow Cider Mill in Waterbury, Vermont makes some of the best.</p>

          <p><strong>A covered bridge detour.</strong> Vermont has more covered bridges per square mile than any other state. The Lamoille County area near Johnson and Morrisville has a cluster easily visited in an afternoon.</p>

          <p><strong>Foliage from above.</strong> Several scenic gondola rides operate during foliage season — Stowe Mountain Resort and Loon Mountain in New Hampshire both offer gondola rides specifically for foliage viewing. The perspective from above the canopy is completely different and worth the ticket price.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Practical Tips</h2>

          <p><strong>Book everything early.</strong> This cannot be overstated. Peak foliage in Vermont is among the most heavily booked travel periods in the Northeast. If you're going in early October, start booking in July or August.</p>

          <p><strong>Embrace the two-lane roads.</strong> The scenic routes — Route 100, the Kancamagus, Route 302 — are slower than the interstate but that's entirely the point. Budget extra time and resist the urge to rush.</p>

          <p><strong>Check the foliage reports weekly.</strong> The color can peak and fade in a matter of days. Build some flexibility into your itinerary so you can chase the color if needed.</p>

          <p><strong>Pack layers.</strong> October in New England can be 65 degrees and sunny or 40 degrees and rainy in the same day. Bring a warm layer, rain jacket, and comfortable walking shoes at minimum.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Ready to Plan Your Trip?</h2>
          <p>Every fall foliage trip is different depending on when you go, where the color is peaking, and how your family likes to travel. Our free AI road trip planner builds a custom day-by-day itinerary around your schedule, driving limits, and must-see stops.</p>
        </div>

        <div style={{ background: "#1F1F1F", borderRadius: 12, padding: "1.5rem", marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", margin: "0 0 8px" }}>Plan Your New England Fall Foliage Road Trip</p>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 16px" }}>Get a free custom day-by-day itinerary built around peak foliage timing, your driving limits, and your favorite stops.</p>
          <Link href="/" style={{ display: "inline-block", background: "#D85A30", color: "white", textDecoration: "none", padding: "10px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
            Build My Itinerary — Free ↗
          </Link>
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb", fontSize: 12, color: "#9ca3af" }}>
          <Link href="/blog" style={{ color: "#6b7280", textDecoration: "none" }}>← Back to all guides</Link>
        </div>
      </article>

      <div style={{ background: "#1F1F1F", borderTop: "3px solid #D85A30", padding: "1rem", textAlign: "center", marginTop: "2rem" }}>
        <div style={{ fontSize: 11, color: "#5F5E5A" }}>
          © 2026 Our Road Trip Planner™ · <Link href="/terms" style={{ color: "#5F5E5A" }}>Terms</Link> · <Link href="/privacy" style={{ color: "#5F5E5A" }}>Privacy</Link>
        </div>
      </div>
    </main>
  );
}
