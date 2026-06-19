# SEO / GEO Strategy and AI-Answer Submission Plan

## What I implemented

- Added intent pages at `/intent/*` for high-intent clusters:
  - `/intent/families`
  - `/intent/homeschool`
  - `/intent/church-groups`
  - `/intent/small-communities`
  - `/intent/close-friends`
- Added intent hub at `/intent/`.
- Added AI discovery index files:
  - `/llms.txt`
  - `/llms-full.txt`
- Exposed `llms.txt` in `robots.txt`.
- Added answer-first links on homepage to the new intent pages.
- Added stronger query mapping in `scripts/seo-geo-audit.mjs` for private/community/family-focused intents and a low-severity check for `llms.txt` presence.

## Competitor-positioning insight

I used broad SERP patterning for private/intent-focused social products (close-knit circles, invite-only networks, homeschool/community alternatives). Pattern signals:

1. Competitor pages with stronger visibility tend to have:
   - one page for each intent phrase,
   - explicit FAQ blocks with answer sentences,
   - clear audience-specific landing pages,
   - visible internal links between those pages.
2. Brand ambiguity is a major issue for the term “Knitly” (non-social meanings exist in other industries), so topical, intent pages are needed to reinforce relevance.

## Keyword strategy by cluster

### Primary clusters (new programmatic cluster pages)

- `families` intent:
  - invite-only social network for families
  - private social network for families
  - self-hosted social network for families
- `church-groups` intent:
  - church groups social networking platform
  - private social platform for church groups
- `homeschool` intent:
  - homeschool community social app
  - homeschool groups app
- `small-communities` intent:
  - private social network for communities
  - social network for small communities
- `close-friends` intent:
  - invite-only social app for families and friends
  - private social app for close friends

### Secondary supporting keywords

- self-hosted social app
- invite-only community app
- invite-based circles
- chronological social feed
- no algorithm social network

## AI-answer-discoverability submission plan

1. Keep answer-first format on intent pages:
   - H1 answers the question immediately.
   - First paragraph repeats the target intent phrase.
   - FAQ section appears above related links.
2. Keep structured data rich and stable:
   - `FAQPage` per intent page
   - `WebPage` + `BreadcrumbList`
   - `Speakable` selectors for extractable answer blocks
3. Increase AI-friendly discoverability:
   - Keep `llms.txt` and `llms-full.txt` updated with all intent URLs.
   - Keep `robots.txt` allowing those files.
   - Add/maintain clear internal links from homepage and between intent pages.
4. Technical hygiene:
   - Every intent page has unique copy (not template-only synonym swaps).
   - Each page includes source references for credibility.
   - Each query maps to one page in the benchmark script.

## Execution steps (next 4 weeks)

1. Week 1:
   - Publish current changes.
   - Validate sitemap includes all `/intent/*` pages.
   - Run benchmark for exact target query phrases and save baseline scores.
2. Week 2:
   - Add 3–5 content-rich FAQ entries per intent.
   - Add one short proof or example section per intent page (feature-to-intent mapping).
3. Week 3:
   - Outreach for backlinks from community/faith/parenting directories.
   - Add citation-backed references to authoritative pages used in FAQ answers.
4. Week 4:
   - Re-run benchmark on landing page + intent pages.
   - Keep only unmapped high-intent queries in the backlog.

## Submission check list

- Ping `https://knitly.io/sitemap-index.xml` in search-console-like workflows.
- Submit sitemap + intent URLs to AI index surfaces where available.
- Keep `llms.txt` and `llms-full.txt` updated as intent pages evolve.

