import Link from "next/link";

export const metadata = {
  title: "Chicago to Mount Rushmore Road Trip: The Ultimate Family Guide",
  description: "Drive from Chicago to Mount Rushmore through the heart of America. Discover the best stops, scenic routes, and family-friendly tips for this iconic Midwest road trip.",
};

export default function ChicagoMtRushmore() {
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
          {["Midwest", "Family Travel", "South Dakota", "Road Trip"].map(tag => (
            <span key={tag} style={{ fontSize: 11, background: "#FEF3EC", color: "#D85A30", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", lineHeight: 1.3, marginBottom: 12 }}>Chicago to Mount Rushmore Road Trip: The Ultimate Family Guide</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "2rem" }}>May 2026 · 10 min read</p>

        <div style={{ fontSize: 16, lineHeight: 1.9, color: "#374151" }}>

          <p>Few road trips capture the soul of America like driving from Chicago to Mount Rushmore. You'll leave the glass towers of the Windy City behind, roll through the wide-open prairies of Wisconsin and Minnesota, and arrive at one of the most iconic landmarks in the country — four presidents carved into a granite mountain in the Black Hills of South Dakota. It's roughly 1,400 miles round trip and takes about 5 to 7 days to do it properly.</p>

          <p>This isn't a trip you rush. The best moments happen somewhere between the Mississippi River and the Badlands — a roadside pie shop, a bison crossing the highway, a sunset over the plains that makes you understand why people call this the heartland.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Why This Road Trip Works for Families</h2>

          <p>The Chicago to Mount Rushmore route is one of the most family-friendly road trips in America. The highways are wide and well-maintained, the drives between major stops are long but manageable, and the attractions along the way range from genuinely awe-inspiring to delightfully weird. Kids who think history is boring will reconsider when they're standing in front of a 60-foot carved face.</p>

          <p>The Black Hills region alone could fill a week — between Mount Rushmore, Crazy Horse Memorial, Custer State Park, Wind Cave National Park, and Deadwood, families rarely run out of things to do. Add the Badlands on the way back and you have one of the most diverse landscapes in the country packed into a single trip.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Best Time to Go</h2>

          <p>Late June through August is peak season and for good reason — the weather is warm, all attractions are fully open, and the Black Hills are at their most beautiful. July 4th at Mount Rushmore is a bucket list experience with a massive fireworks display, but book accommodations months in advance if you want to go during that week.</p>

          <p>September is arguably the sweet spot. Crowds thin out, temperatures are still comfortable, and the hills take on early fall color. Avoid November through April unless you enjoy driving through blizzards — South Dakota winters are serious business.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>The Route: Day by Day Highlights</h2>

          <p><strong>Day 1 — Chicago to Madison, WI (about 2.5 hours)</strong></p>
          <p>Start your trip by heading north through Chicago's suburbs on I-90 toward Madison. Wisconsin's capital city is an underrated first stop — it sits on an isthmus between two lakes and has a lively State Street with great restaurants and coffee shops. The Wisconsin State Capitol building is worth a quick visit, and if you're traveling with kids, the Henry Vilas Zoo is free.</p>

          <p><strong>Day 2 — Madison to Mitchell, SD (about 6 hours)</strong></p>
          <p>This is your big driving day across the Minnesota prairie. Break it up in La Crosse where the Mississippi River crossing is genuinely beautiful, then continue through Minnesota farm country. Your destination is Mitchell, South Dakota — home of the Corn Palace, a municipal auditorium decorated entirely in murals made from corn. It's exactly as wonderfully strange as it sounds and kids absolutely love it.</p>

          <p><strong>Day 3 — Mitchell to the Badlands and Wall Drug (about 2 hours)</strong></p>
          <p>Drive west on I-90 toward one of the most dramatic landscapes in America. Badlands National Park is a geological marvel — jagged spires, layered buttes, and fossil beds rising out of the prairie without warning. The Loop Road through the park takes about two hours and offers some of the best roadside views in the country. Stop at the Ben Reifel Visitor Center to learn about the formations. Then swing through Wall, South Dakota to see Wall Drug — the most aggressively marketed tourist stop in America and genuinely fun for it.</p>

          <p><strong>Day 4 — Black Hills and Mount Rushmore (about 1.5 hours from Wall)</strong></p>
          <p>This is the day. Continue west to Rapid City, then south into the Black Hills toward Keystone and Mount Rushmore National Memorial. Arrive early — the lighting is best in the morning and crowds build quickly after 10am. The Avenue of Flags walkway leading to the viewing terrace is one of the most powerful approaches to any landmark in America. Allow at least two hours here. In the afternoon, drive 17 miles southwest to the Crazy Horse Memorial, still under active construction since 1948 — the scale of what's being carved is staggering.</p>

          <p><strong>Day 5 — Custer State Park and the Wildlife Loop</strong></p>
          <p>Don't leave the Black Hills without driving the Wildlife Loop Road in Custer State Park. In the early morning or late afternoon, bison herds often block the road entirely — which sounds inconvenient and is actually one of the best experiences this trip has to offer. The park also has burros that will absolutely stick their heads in your car window looking for snacks. Wind Cave National Park is nearby if your family enjoys cave tours.</p>

          <p><strong>Days 6-7 — Return to Chicago</strong></p>
          <p>Head back east, either retracing your route or taking a slightly different path through Sioux Falls, which has a surprisingly beautiful downtown waterfall park. Break the return drive in Minneapolis or Madison.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Don't Miss Along the Way</h2>

          <p><strong>The Badlands at sunrise or sunset.</strong> The light on those formations at golden hour is unlike anything else in the country. If you're camping in the park, you'll have front-row seats.</p>

          <p><strong>Sylvan Lake in Custer State Park.</strong> The granite boulders surrounding this small lake look like they were arranged by a movie set designer. It's one of the most photogenic spots in the Black Hills and easily accessible.</p>

          <p><strong>Deadwood, SD.</strong> The historic gold rush town is fully walkable and has a fascinating history. Kids who have seen the era in books or on screen will get a kick out of the preserved Main Street.</p>

          <p><strong>A Midwest diner breakfast.</strong> Somewhere in Wisconsin or Minnesota, stop at a proper small-town diner for breakfast. The kind with laminated menus and unlimited coffee refills. It's part of the trip.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Practical Tips</h2>

          <p><strong>Book Black Hills accommodations early.</strong> The Rapid City and Keystone area fills up fast in summer, especially around July 4th. Budget travelers do well in Custer or Hill City which are quieter and closer to the park.</p>

          <p><strong>Get the America the Beautiful pass.</strong> At $80, the annual National Parks pass pays for itself on this trip alone — it covers both Badlands and Mount Rushmore entry fees.</p>

          <p><strong>Fill up before the Badlands.</strong> Gas stations are sparse once you're in the park. Wall has a Walmart and multiple gas stations — stock up on snacks and fuel before heading into Badlands.</p>

          <p><strong>Give yourself more time than you think.</strong> The Black Hills specifically rewards slow travel. Families who try to rush through in one day leave wishing they had stayed longer.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", fontFamily: "Georgia, serif", marginTop: "2rem", marginBottom: "0.75rem" }}>Ready to Plan Your Trip?</h2>
          <p>Every family's road trip looks different — different driving limits, different interests, different ages. Our free AI road trip planner builds a custom day-by-day itinerary for your Chicago to Mount Rushmore trip based on exactly how your family travels.</p>
        </div>

        <div style={{ background: "#1F1F1F", borderRadius: 12, padding: "1.5rem", marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#F5F5F0", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", margin: "0 0 8px" }}>Plan Your Chicago to Mount Rushmore Road Trip</p>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 16px" }}>Get a free custom day-by-day itinerary built around your family's driving limits, interests, and budget.</p>
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
