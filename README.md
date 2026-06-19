# Knitly Landing

## What this includes
- Homepage SEO baseline + FAQ-driven structured data
- Intent pages under `/intent/*` for programmatic keyword capture
- AI-answer discoverability files: `llms.txt` and `llms-full.txt`

## SEO/GEO execution checklist

1. Run local audit
   - `node scripts/seo-geo-audit.mjs`
   - Confirm no high-impact technical gaps
   - Confirm query coverage includes target intent phrases

2. Publish pages and index surfaces
   - Ensure `robots.txt` includes sitemap and `llms.txt` path
   - Confirm `/intent/*` pages are reachable via homepage links

3. Submit/refresh to engines and AI surfaces
   - Update and validate `https://knitly.io/sitemap-index.xml`
   - Submit sitemap in search console or equivalent index workflow
   - Keep `llms.txt` and `llms-full.txt` updated with new intent URLs

4. Validate build and deploy
   - Tag a release using `v*` convention
   - Push tag to trigger `.github/workflows/deploy.yml`
   - Confirm workflow URL shows `conclusion: success`

## Related notes

- Primary keywords targeted:
  - invite-only social network for families
  - homeschool community social app
  - church groups social networking platform
  - private social network for communities
  - private social app for families and friends
  - self-hosted social network for families

