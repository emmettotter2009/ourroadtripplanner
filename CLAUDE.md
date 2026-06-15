Our Road Trip Planner — Claude Code Project Context

What This Is

A Next.js web app at ourroadtripplanner.com that generates AI-powered road trip itineraries.
Live and in early-stage launch. Public GitHub repo: emmettotter2009/ourroadtripplanner.
Deployed on Vercel (Hobby plan). Auto-deploys from main branch on push.


Tech Stack


Framework: Next.js (App Router)
Deployment: Vercel (Hobby plan, auto-deploy from main)
AI: Anthropic Claude API — model claude-sonnet-4-5 via ANTHROPIC_API_KEY
Email: Resend (RESEND_API_KEY) — domain verified
Rate limiting: Upstash Redis (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
Analytics: Google Analytics G-3KW7DZZNPL via Next.js Script component
Domain: Namecheap (DNS managed by Vercel)


Environment Variables (names only — values are in Vercel)


ANTHROPIC_API_KEY
RESEND_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN



Key Files to Know


components/RoadTripPlanner.jsx — main UI component (~1,200 lines, refactor is a known task)
app/api/ — API routes (itinerary generation, email send, feedback)
app/page.js — homepage



Active Affiliate System

Affiliate links are injected via a [CITY:X] tag system embedded in the AI prompt.


Tags are silently parsed and stripped from user-visible output
Tags power hotel, activity, and car rental links in emailed itineraries
Do not remove or alter this tag parsing logic without explicit instruction


Active Affiliate Partners & IDs (these are public-facing values, NOT secrets)


Booking.com via Awin — publisher ID 2880651
GetYourGuide — partner ID CKJU4TS
Amazon Associates — tag ourroadtrippl-20
Marriott via Partnerize — pending approval
CJ Affiliate — ID 101740591



Security & Rate Limiting


IP-based rate limiting: 10 requests/hour via Upstash Redis
Email endpoint is secured
All secrets in Vercel environment variables only — never in code or repo



AI / API Configuration


Model: claude-sonnet-4-5
max_tokens is intentionally reduced for cost control — do not increase without asking
Auto-reload for Anthropic credits is disabled — do not enable it
Streaming was evaluated and reverted — the UX is spinner-then-full-render, not streaming
Chat context: compact per-day summary + last 6 messages



Brand & Legal


Brand name: Our Road Trip Planner™
Tagline: Every Road · Your Way™
Both are USPTO trademark applications (Classes 039 and 042)
Brand colors: orange #D85A30, navy #1e3a5f, charcoal #1F1F1F
Headings: Georgia serif
Contact email: ourroadtripplanner@gmail.com
Do not use em dashes (—) in any public-facing copy



What NOT To Do (Do Not Change Without Explicit Instruction)


Do NOT add user accounts or login — "no cookies" is a deliberate competitive differentiator and marketing asset
Do NOT enable streaming — full render after spinner is the intentional UX choice
Do NOT enable auto-reload for Anthropic credits
Do NOT increase max_tokens without asking
Do NOT add Expedia affiliate links alongside Booking.com (link-farm appearance risk)
Do NOT add IHG or Best Western — these programs were rejected/removed; adding them would violate FTC affiliate disclosure compliance
Do NOT commit .env files or secrets to the repo
Do not alter the [CITY:X] affiliate tag parsing logic without explicit instruction



How the Owner Works


Edits code by pasting directly into GitHub's web editor — no local dev environment
Vercel auto-deploys on push to main
Branch protection is enabled — be aware of this for any branch/PR suggestions
Prefers to review and confirm before implementing changes
Always confirm before making breaking changes or changes that affect cost/API usage



Known Pending Tasks (quiet-period work)


Refactor RoadTripPlanner.jsx — 1,200-line file, split into logical sub-components
Expedia affiliate integration — deferred, pending decision
Hilton affiliate via Awin — not yet applied for
Marriott Partnerize — awaiting approval
TikTok video for traffic (external task, not code)



Cost Sensitivity

This is a Tier 1 Anthropic account with spend alerts configured.
Any change that increases API call frequency, token count, or adds new AI-powered features
should be flagged to the owner BEFORE implementing, with an estimate of cost impact.
