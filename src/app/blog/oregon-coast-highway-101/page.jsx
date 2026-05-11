import Link from "next/link";

export const metadata = {
  title: "Oregon Coast Road Trip: The Complete Highway 101 Guide",
  description: "Drive Oregon's Highway 101 from Portland to the California border. Discover the best beaches, viewpoints, seafood spots, and family-friendly stops on the Oregon Coast.",
};

export default function OregonCoast() {
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
          {["Pacific Northwest", "Oregon", "Scenic Drive", "Family Travel"].map(tag => (
            <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", lineHeight: 1.3, marginBottom: 12 }}>Oregon Coast Road Trip: The Complete Highway 101 Guide</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "2rem" }}>May 2026 · 10 min read</p>

        <div style={{ fontSize: 16, lineHeight: 1.9, color: "#374151" }}>

          <p>Oregon's Highway 101 is one of the most scenic drives in North America — full stop. For nearly 400 miles, the road hugs the Pacific coastline through sea stacks, ancient rainforests, charming fishing towns, and some of the most dramatic viewpoints you'll find anywhere in the world. It's also one of the few coastal drives where you can pull off and walk on virtually any beach for free, any time, because Oregon law guarantees public access to the entire coastline.</p>

          <p>Most people drive it south from Portland to the California border, which puts the ocean on your right and gives you the best views from the driver's seat. Plan for four to six days if you want to do it properly, though serious beach lovers could happily spend two weeks.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Why the Oregon Coast is Different</h2>

          <p>Unlike California's coast, Oregon's Highway 101 is dramatically uncrowded by comparison — especially outside of summer weekends. The beaches are wide and wild. Logs wash up on shore regularly. The water is cold enough to swim in only if you're a child or deeply committed to the experience. The towns are small, the food is fresh, and the scenery changes constantly.</p>

          <p>It's also strikingly affordable compared to comparable coastal drives. Oregon has no sales tax, state parks charge minimal fees, and the seafood — particularly Dungeness crab and razor clams — is exceptional and reasonably priced at local restaurants and markets.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Best Time to Go</h2>

          <p>July and August are the driest months and the safest bet for sunshine, though the coast is famously cooler than inland Oregon — bring layers even in midsummer. June can be foggy (a phenomenon locals call "Junuary") but often clears by afternoon. September is increasingly popular: fewer crowds, still warm enough, and the light has that golden quality that makes every photo look cinematic.</p>

          <p>Spring and fall are quieter and perfectly driveable with rain gear. Winter storms on the Oregon Coast are spectacular if you're prepared for them — huge waves, dramatic skies, and almost no other tourists.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>The Route: Day by Day Highlights</h2>

          <p><strong>Day 1 — Portland to Cannon Beach (about 1.5 hours)</strong></p>
          <p>Head west from Portland on US-26 through the Coast Range and drop down into Cannon Beach, one of the most photographed towns on the Oregon Coast. Haystack Rock dominates the beach — a 235-foot sea stack that's home to nesting seabirds and surrounded by tide pools at low tide. Walk the main beach at sunset if the timing works. Cannon Beach town itself is walkable with good galleries, bakeries, and the consistently excellent Stephanie Inn for a splurge stay.</p>

          <p><strong>Day 2 — Cannon Beach to Lincoln City (about 2 hours)</strong></p>
          <p>Drive south on 101 through Tillamook, home of the Tillamook Creamery — a genuine must-stop. The factory tour is free and the ice cream is unreasonably good. Continue south through Pacific City where you can watch dory boats launch directly off the beach into the surf, then into Lincoln City. The stretch of 101 between Cannon Beach and Lincoln City is some of the most scenic on the entire coast.</p>

          <p><strong>Day 3 — Lincoln City to Newport (about 1 hour)</strong></p>
          <p>Newport is the working heart of the Oregon Coast — a real fishing town with a historic bayfront where crab boats unload their catch daily. The Oregon Coast Aquarium here is excellent and particularly good for families — sea otters, sharks, and a massive jellyfish exhibit. The Hatfield Marine Science Center next door is free and equally impressive. Walk the Bayfront district for chowder and fresh Dungeness crab from the fish markets.</p>

          <p><strong>Day 4 — Newport to Florence (about 1.5 hours)</strong></p>
          <p>The stretch south of Newport gets wilder and less visited. Cape Perpetua Scenic Area has some of the most dramatic coastal geology on the coast — Thor's Well, a collapsed sea cave that fills dramatically with waves, and Spouting Horn nearby. Time your visit around high tide for maximum drama. Continue to Florence at the north end of the Oregon Dunes, where massive sand dunes meet the ocean in a landscape that looks genuinely surreal.</p>

          <p><strong>Day 5 — Florence to Bandon (about 2 hours)</strong></p>
          <p>The Oregon Dunes stretch 40 miles south of Florence — rent an ATV if your group is adventurous. Continue to Coos Bay and then Bandon, one of the most underrated towns on the Oregon Coast. Bandon's sea stack formations at Face Rock State Scenic Viewpoint are arguably the most dramatic on the entire coast. The town has excellent cheese (Face Rock Creamery), fresh cranberries, and a relaxed Old Town with good restaurants.</p>

          <p><strong>Day 6 — Bandon to the California Border (about 2 hours)</strong></p>
          <p>The southern Oregon Coast is remote and stunning. Samuel H. Boardman State Scenic Corridor between Brookings and Gold Beach has viewpoint after viewpoint — Natural Bridges, Arch Rock, Secret Beach — and is consistently ranked among the most beautiful stretches of coastal highway in America. Brookings is the last Oregon town before California, known for its mild climate and excellent fishing.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Don't Miss Along the Way</h2>

          <p><strong>Tide pool exploring.</strong> Oregon's coast has exceptional tide pools, particularly around Cannon Beach, Cape Perpetua, and Yachats. Low tide reveals sea stars, anemones, urchins, and hermit crabs. Check tide tables before you go.</p>

          <p><strong>Yachats.</strong> This small town between Newport and Florence is a local favorite and consistently undervisited by tourists. The 804 Trail winds along the rocky shoreline and the restaurant scene is surprisingly strong for a town of 700 people.</p>

          <p><strong>Whale watching.</strong> Gray whales migrate along the Oregon Coast in December-January and March-June. Depoe Bay, the self-proclaimed whale watching capital of the Oregon Coast, has a free whale watch center on the seawall.</p>

          <p><strong>Fresh Dungeness crab.</strong> If you're on the coast between November and August, eat the crab. Buy it live from a dockside market if you have a kitchen, or order it at any bayfront restaurant in Newport or Coos Bay.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Practical Tips</h2>

          <p><strong>Layer relentlessly.</strong> The Oregon Coast has its own microclimate. Mornings are often foggy and cool even in August. A fleece and windbreaker are essential even if you're coming from 90-degree heat in Portland.</p>

          <p><strong>Check tide tables.</strong> Many of the best experiences on this coast — tide pooling, Thor's Well, certain beach walks — depend entirely on timing with the tides. Download a tide table app before you go.</p>

          <p><strong>Book ahead in summer.</strong> Cannon Beach and Newport fill up fast on summer weekends. Midweek stays are noticeably quieter and often cheaper. The smaller towns — Yachats, Bandon, Brookings — are easier to find last-minute accommodation.</p>

          <p><strong>Oregon state parks are exceptional.</strong> Many of the best viewpoints and beaches are state parks with free access. The Oregon Coast Trail connects many of them for hikers.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Ready to Plan Your Trip?</h2>
          <p>The Oregon Coast is long enough that every family's trip looks different. Some want to linger in Cannon Beach for three days. Others want to hit every viewpoint between Portland and California. Our free AI road trip planner builds a custom itinerary around your driving limits, interests, and travel style.</p>
        </div>

        <div style={{ background: "#1F1F1F", borderRadius: 12, padding: "1.5rem", marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", margin: "0 0 8px" }}>Plan Your Oregon Coast Road Trip</p>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 16px" }}>Get a free custom day-by-day itinerary built around your driving limits, must-see stops, and travel style.</p>
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
