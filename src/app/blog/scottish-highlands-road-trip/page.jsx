import Link from "next/link";

export const metadata = {
  title: "Scottish Highlands Road Trip: The Ultimate Self-Drive Guide",
  description: "Plan the ultimate Scottish Highlands road trip. Discover the North Coast 500, Loch Ness, Glencoe, Isle of Skye, and everything you need to know about driving in Scotland.",
};

export default function ScottishHighlands() {
  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "sans-serif" }}>
      <div style={{ background: "#1F1F1F", borderBottom: "3px solid #D85A30", padding: "1rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}>Our Road Trip Planner</div>
            <div style={{ color: "#D85A30", fontSize: 10, letterSpacing: "0.15em" }}>EVERY ROAD · YOUR WAY</div>
          </Link>
          <Link href="/blog" style={{ fontSize: 13, color: "#7BAFD4", textDecoration: "none" }}>← All guides</Link>
        </div>
      </div>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1rem" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["Europe", "Scotland", "Scenic Drive", "North Coast 500"].map(tag => (
            <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", lineHeight: 1.3, marginBottom: 12 }}>Scottish Highlands Road Trip: The Ultimate Self-Drive Guide</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "2rem" }}>May 2026 · 12 min read</p>

        <div style={{ fontSize: 16, lineHeight: 1.9, color: "#374151" }}>

          <p>The Scottish Highlands are one of the last truly wild places in Europe. Driving through them feels like traveling back in time — past ancient castles, through glens that saw clan battles and clearances, along sea lochs that mirror the sky, and over single-track roads where the only traffic is the occasional sheep that refuses to move. It's dramatic, occasionally melancholy, and utterly unforgettable.</p>

          <p>The most popular self-drive route is the North Coast 500 — a roughly 500-mile loop from Inverness around the northern tip of Scotland that was launched in 2015 and has since become one of Europe's most celebrated road trips. But the Highlands offer much more than just the NC500, including the Isle of Skye, Glencoe, and the whisky distilleries of Speyside. A proper Highlands road trip takes at least seven to ten days.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Essential: Driving in Scotland</h2>

          <p>Before anything else — if you're coming from North America, you'll be driving on the left side of the road. This takes about 30 minutes to feel natural and about two days to feel completely comfortable. The bigger adjustment is the single-track roads that make up much of the Highland road network. These are exactly what they sound like: roads wide enough for one vehicle, with passing places every 100 to 200 metres. The rule is simple — if you meet oncoming traffic, the person nearest a passing place pulls into it. Locals are generally patient with visitors who don't yet have the rhythm.</p>

          <p>Fuel up whenever you can. Petrol stations in the far northwest can be 40 to 50 miles apart and keep limited hours. Many don't accept foreign credit cards without a PIN. Carry some cash.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Best Time to Go</h2>

          <p>May and June are increasingly popular — long daylight hours (sunset after 10pm in late June), wildflowers on the moors, and fewer midges than July and August. The midge situation deserves a paragraph of its own: these tiny biting insects swarm in still, humid conditions and can make outdoor activities genuinely miserable from late June through August. They hate wind and sunshine, which conveniently are also the conditions that make the Highlands most beautiful. A midge head net is not optional if you're going in midsummer.</p>

          <p>September and early October offer gorgeous light, turning heather, and significantly reduced crowds. Winter in the Highlands is dramatic and moody but comes with short days, some road closures, and unpredictable weather.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>The Route: Day by Day Highlights</h2>

          <p><strong>Day 1 — Arrive in Inverness, explore the city</strong></p>
          <p>Inverness is the capital of the Highlands and your natural starting point, with an international airport and good rail connections from Edinburgh and London. The city is compact and walkable — the pink sandstone castle overlooking the River Ness, the Victorian market, and the riverside walk are all worth an afternoon. Book dinner at one of the excellent local restaurants; the seafood this far north is exceptional.</p>

          <p><strong>Day 2 — Loch Ness and Glencoe (about 2-3 hours driving)</strong></p>
          <p>Head south along the western shore of Loch Ness on the B852 rather than the main A82 — it's slower and far more scenic, with views across the loch the whole way. Urquhart Castle, dramatically situated on a promontory partway along, is worth the stop. Continue south to Glencoe, one of the most haunting landscapes in Scotland — a broad glacial valley flanked by steep ridges with a history of massacre that you feel in the silence. The visitor center explains the 1692 Glencoe Massacre. Spend the night in Glencoe village or nearby Ballachulish.</p>

          <p><strong>Day 3 — Isle of Skye (about 1.5 hours from Glencoe)</strong></p>
          <p>Cross the Skye Bridge from Kyle of Lochalsh — the crossing takes seconds but the landscape change is immediate. Skye is the largest and most visited of Scotland's islands, and for good reason. The Fairy Pools near Glenbrittle are a series of crystal-clear blue pools and waterfalls at the foot of the Cuillin mountains. The Old Man of Storr, a dramatic rock pinnacle visible from the north of the island, is a short but steep hike. Portree, the island's main town, has a colorful harbor front and excellent seafood. Allow at least two nights on Skye.</p>

          <p><strong>Day 4 — Skye exploration day</strong></p>
          <p>The Quiraing on Skye's northern peninsula is one of the most otherworldly landscapes in Scotland — a landslip of rock formations and plateaus that looks like a film set. The single-track road to the trailhead is hair-raising in the best possible way. Neist Point Lighthouse at the western tip of the island offers views to the Outer Hebrides on clear days. Dunvegan Castle, home of the Clan MacLeod, is the oldest continuously inhabited castle in Scotland and open to visitors.</p>

          <p><strong>Day 5-6 — The North Coast 500: Inverness to Durness</strong></p>
          <p>Return to Inverness and begin the NC500 loop heading west. The route passes through Torridon, where some of the oldest rocks on earth form dramatic mountains rising straight from sea level. Applecross, reached via the Bealach na Bà — one of the highest mountain passes in Britain — has a famous pub with views across to Skye that makes the terrifying drive up worth every moment. Continue north along the coast to Ullapool, a proper fishing village with a good arts scene, and on to Durness at Scotland's northwestern corner. The drive along this stretch is among the most dramatic coastal road in Europe.</p>

          <p><strong>Day 7 — Durness to Thurso: The Far North</strong></p>
          <p>The north coast of Scotland is wild and desolate in the best possible way. Smoo Cave near Durness is a vast sea cave accessible by short boat trip. Cape Wrath — the most northwestern point of mainland Britain — requires a ferry and minibus to reach but rewards the effort with vertiginous cliffs and a genuine sense of being at the edge of the world. Continue east along the coast past the ruins of Ardvreck Castle and the flow country — the largest blanket bog in Europe, a UNESCO World Heritage site — to Thurso.</p>

          <p><strong>Day 8 — John O'Groats and the East Coast return</strong></p>
          <p>John O'Groats is the most northeastern point of mainland Britain and the traditional end of the Land's End to John O'Groats route. It's famously underwhelming as a location but the point is the achievement of being there. Continue east past the Castle of Mey — the late Queen Mother's Scottish home — and south along the east coast through the dramatic Dunrobin Castle, the largest house in the northern Highlands and topped with French-style turrets, back toward Inverness.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Don't Miss Along the Way</h2>

          <p><strong>A Highland distillery tour.</strong> The Speyside region east of Inverness has the highest concentration of whisky distilleries in the world. Glenfiddich, Macallan, and Glenlivet all offer tours, some with exceptional tastings. Even if whisky isn't your thing, the process is fascinating and the landscape is beautiful.</p>

          <p><strong>Wild camping.</strong> Scotland has some of the most progressive right-to-roam laws in the world — wild camping is legal almost anywhere as long as you follow the Scottish Outdoor Access Code. Waking up in a tent beside a Highland loch with no other humans visible is a genuinely extraordinary experience.</p>

          <p><strong>Eilean Donan Castle.</strong> On the road to Skye, this turreted castle on a small island where three sea lochs meet is one of the most photographed buildings in Scotland. It looks exactly like a movie castle because it has been one many times.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Practical Tips</h2>

          <p><strong>Book accommodation well in advance.</strong> The NC500's popularity has made accommodation in the far northwest genuinely scarce in summer. Book months ahead for July and August, particularly in Durness, Tongue, and Thurso.</p>

          <p><strong>Download offline maps.</strong> Mobile signal is nonexistent across significant stretches of the Highlands. Download the area in Google Maps or Maps.me before you leave signal range.</p>

          <p><strong>Embrace the weather.</strong> Highland weather changes constantly — four seasons in one day is a cliché because it's true. The light after a Highland rain shower on the mountains is some of the most beautiful light you'll ever see. Pack waterproofs and don't let the forecast make decisions for you.</p>

          <p><strong>Slow down.</strong> The NC500 can technically be driven in three days. This is like saying the Louvre can technically be seen in two hours. The whole point is to stop constantly, walk to viewpoints, eat in small restaurants, and talk to locals.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Ready to Plan Your Trip?</h2>
          <p>Every Scottish Highlands road trip looks different — some people want the NC500 in full, others want to base themselves on Skye for a week. Our free AI road trip planner builds a custom day-by-day itinerary around your pace, interests, and must-see stops.</p>
        </div>

        <div style={{ background: "#1F1F1F", borderRadius: 12, padding: "1.5rem", marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", margin: "0 0 8px" }}>Plan Your Scottish Highlands Road Trip</p>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 16px" }}>Get a free custom day-by-day itinerary for the NC500, Isle of Skye, Glencoe, and beyond — built around your travel style.</p>
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
