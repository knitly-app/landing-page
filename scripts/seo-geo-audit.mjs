#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const pagesRoot = path.join(projectRoot, 'src', 'pages');
const robotsPath = path.join(projectRoot, 'public', 'robots.txt');

const targetQueries = [
  {
    id: 'family-social',
    query: 'self-hosted social network for families',
    terms: ['self-hosted', 'social network', 'families'],
  },
  {
    id: 'invite-only',
    query: 'invite-only social app for families and friends',
    terms: ['invite-only', 'social app', 'communities'],
  },
  {
    id: 'privacy',
    query: 'private social network for communities',
    terms: ['private', 'social network', 'communities'],
  },
  {
    id: 'church',
    query: 'church groups social networking platform',
    terms: ['church', 'group', 'social', 'network'],
  },
  {
    id: 'homeschool',
    query: 'homeschool community social app',
    terms: ['homeschool', 'community', 'social'],
  },
];

function walkPages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkPages(full));
    } else if (entry.isFile() && full.endsWith('.astro')) {
      files.push(full);
    }
  }
  return files;
}

function stripFrontmatter(raw) {
  if (!raw.startsWith('---')) return raw;
  const second = raw.indexOf('\n---', 3);
  return second === -1 ? raw : raw.slice(second + 4);
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function normalizeText(text) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function extractJsonLd(raw) {
  const scripts = [...raw.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.map((m) => m[1].trim()).filter(Boolean);
}

function extractLinks(raw) {
  return [...raw.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, ' ').trim() }));
}

function extractHeadings(raw) {
  return [...raw.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    level: Number(m[1][1]),
    text: m[2].replace(/<[^>]+>/g, ' ').trim(),
  }));
}

function collectTechChecks(raw) {
  const checks = [];
  const hasRobots = /<meta[^>]*name=["']robots["'][^>]*>/i.test(raw);
  const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*>/i.test(raw);
  const hasTitle = /<title[^>]*>([\s\S]*?)<\/title>/i.test(raw);
  const hasDescription = /<meta[^>]*name=["']description["'][^>]*>/i.test(raw);
  const hasOpenGraphTitle = /<meta[^>]*property=["']og:title["'][^>]*>/i.test(raw);
  const hasOpenGraphDesc = /<meta[^>]*property=["']og:description["'][^>]*>/i.test(raw);
  const links = extractLinks(raw);

  const placeholderLinks = links.filter((link) => link.href === '#');

  const jsonLdBlocks = extractJsonLd(raw);
  const hasJsonLd = jsonLdBlocks.length > 0;
  const hasFAQSchema = jsonLdBlocks.some((script) => /"@type"\s*:\s*"FAQPage"/i.test(script));
  const hasProductSchema = jsonLdBlocks.some((script) => /"@type"\s*:\s*"SoftwareApplication"/i.test(script));

  const internalLinks = links.filter((link) => {
    const href = link.href;
    return href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || href.startsWith('#') || href.startsWith('?');
  }).length;

  const allLinks = links.length;

  if (!hasRobots) {
    checks.push({ severity: 'high', area: 'indexation', finding: 'Missing robots/indexability meta tag', impact: 'Can default to indexing but lacks explicit control and clarity' });
  }

  if (!hasCanonical) {
    checks.push({ severity: 'high', area: 'indexation', finding: 'Missing canonical tag', impact: 'Duplicate URL variants can be canonicalized incorrectly' });
  }

  if (!hasTitle) {
    checks.push({ severity: 'high', area: 'title', finding: 'Missing <title>', impact: 'No snippet title for search/AI engine extraction' });
  }

  if (!hasDescription) {
    checks.push({ severity: 'high', area: 'meta', finding: 'Missing meta description', impact: 'No clear summary for SERP snippets or AI retrieval pipelines' });
  }

  if (!hasOpenGraphTitle || !hasOpenGraphDesc) {
    checks.push({ severity: 'medium', area: 'social', finding: 'Partial Open Graph metadata', impact: 'Social and feed previews will be weaker' });
  }

  if (!hasJsonLd) {
    checks.push({ severity: 'high', area: 'structured data', finding: 'No JSON-LD structured data', impact: 'Question-answer extraction and rich results are harder' });
  }

  if (!hasFAQSchema) {
    checks.push({ severity: 'high', area: 'GEO', finding: 'No FAQ schema for direct answer extraction', impact: 'Lower answer-eligibility in AI engines' });
  }

  if (placeholderLinks.length > 0) {
    checks.push({ severity: 'medium', area: 'internal links', finding: 'Placeholder internal link (`#`) in primary nav', impact: 'Missed internal linking signal and weak crawl graph' });
  }

  if (allLinks > 0 && internalLinks === 0) {
    checks.push({ severity: 'medium', area: 'internal links', finding: 'No meaningful internal links to crawl', impact: 'Lower internal discovery and page-level topical authority' });
  }

  if (!hasProductSchema) {
    checks.push({ severity: 'medium', area: 'structured data', finding: 'No SoftwareApplication schema', impact: 'Product intent classification misses structured product signals' });
  }

  return {
    hasRobots,
    hasCanonical,
    hasTitle,
    hasDescription,
    hasOpenGraphTitle,
    hasOpenGraphDesc,
    hasJsonLd,
    hasFAQSchema,
    hasProductSchema,
    links,
    placeholderLinks,
    allLinks,
    internalLinks,
    checks,
  };
}

function evaluateAnswerReadiness(raw, headings) {
  const findings = [];
  const lower = raw.toLowerCase();
  const hasHeroIntent = /<h1[^>]*>[^<]*(self-hosted|social network|famil|invite-only)[^<]*<\/h1>/i.test(raw);
  if (!hasHeroIntent) {
    findings.push({ severity: 'high', area: 'answer-first', finding: 'No clear answer statement near top-level heading', impact: 'GEO engines may not map query intent fast' });
  }

  const answerLead = /<h1[^>]*>[\s\S]{0,160}<\/h1>[\s\S]{0,260}<p[^>]*>[^<]+/i.test(raw);
  if (!answerLead) {
    findings.push({ severity: 'medium', area: 'answer-first', finding: 'No immediate concise explanatory paragraph after heading', impact: 'Lower answer extraction confidence' });
  }

  const hasFAQSection = /<section[^>]*>[\s\S]*faq/i.test(raw) || /<h[12][^>]*>[^<]*FAQ/i.test(raw);
  if (!hasFAQSection) {
    findings.push({ severity: 'high', area: 'GEO', finding: 'No explicit FAQ section', impact: 'Direct answer matching is weak for query benchmark' });
  }

  const sourceSignals = /Sources?|Sources?:/i.test(raw) || /\[\d+\]/.test(raw);
  if (!sourceSignals) {
    findings.push({ severity: 'low', area: 'citations', finding: 'No citation source block for factual claims', impact: 'Credibility and source-grounded extraction are weaker' });
  }

  return findings;
}

function benchmarkQueries(raw, pagePath, text, headings) {
  const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = raw.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const title = titleMatch ? titleMatch[1].toLowerCase() : '';
  const desc = descMatch ? descMatch[1].toLowerCase() : '';

  const headingText = headings.map((h) => `${'h'.repeat(h.level)}: ${h.text.toLowerCase()}`).join(' | ');

  return targetQueries.map((item) => {
    const termHitsInTitle = item.terms.filter((term) => title.includes(term.toLowerCase())).length;
    const termHitsInDesc = item.terms.filter((term) => desc.includes(term.toLowerCase())).length;
    const termHitsInH = item.terms.filter((term) => headingText.includes(term.toLowerCase())).length;
    const termHitsInText = item.terms.filter((term) => text.includes(term.toLowerCase())).length;

    const coverage = Math.round(
      (termHitsInTitle / item.terms.length) * 35 +
        (termHitsInDesc / item.terms.length) * 25 +
        (termHitsInH / item.terms.length) * 25 +
        (termHitsInText / item.terms.length) * 15,
    );

    const directQuestion = headings.some((heading) => {
      const normalizedHeading = heading.text.toLowerCase();
      return item.terms.every((term) => normalizedHeading.includes(term) || normalizedHeading.includes(item.query));
    });

    return {
      page: pagePath.replace('src/pages/', '').replace('.astro', ''),
      query: item.query,
      coverage,
      directQuestion,
      directSignals: {
        title: termHitsInTitle,
        description: termHitsInDesc,
        heading: termHitsInH,
        text: termHitsInText,
      },
      topGap: coverage < 70 ? 'Needs explicit section answer with terms in heading/body' : 'Covered',
      risk: coverage >= 90 ? 'low' : coverage >= 70 ? 'medium' : 'high',
      mappingStatus: coverage >= 70 ? 'mapped' : 'unmapped',
    };
  });
}

function runCrawlabilityScan() {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  const issues = [];

  if (!/User-agent:\s*\*/i.test(robots)) {
    issues.push({ severity: 'medium', area: 'crawlability', finding: 'robots.txt lacks default User-agent rule', impact: 'Could reduce crawl guidance consistency' });
  }

  if (!/Allow:\s*\//i.test(robots)) {
    issues.push({ severity: 'high', area: 'crawlability', finding: 'robots.txt does not explicitly allow root', impact: 'Potential crawl blockage on root path' });
  }

  if (!/Sitemap:\s*https?:\/\//i.test(robots)) {
    issues.push({ severity: 'low', area: 'crawlability', finding: 'robots.txt does not reference sitemap', impact: 'Discovery may be slower' });
  }

  return issues;
}

function rankIssues(issues) {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...issues].sort((a, b) => rank[a.severity] - rank[b.severity]);
}

function scorePage(raw, file) {
  const body = stripFrontmatter(raw);
  const rawText = normalizeText(body);
  const headings = extractHeadings(body);

  const techChecks = collectTechChecks(body);
  const answerChecks = evaluateAnswerReadiness(body, headings);
  const queryBench = benchmarkQueries(body, file, rawText, headings);

  return {
    file,
    techChecks,
    answerChecks,
    queryBench,
    unmapped: queryBench.filter((q) => q.risk === 'high' || q.mappingStatus === 'unmapped'),
  };
}

const pageFiles = walkPages(pagesRoot);
const crawlIssues = runCrawlabilityScan();

const results = pageFiles.map((file) => scorePage(readText(file), path.relative(projectRoot, file)));

const allIssues = [...crawlIssues, ...results.flatMap((r) => [...r.techChecks.checks, ...r.answerChecks])];
const ranked = rankIssues(allIssues);

const highImpactCount = ranked.filter((item) => item.severity === 'high').length;
const mediumImpactCount = ranked.filter((item) => item.severity === 'medium').length;
const lowImpactCount = ranked.filter((item) => item.severity === 'low').length;

console.log('\nSEO/GEO Technical Audit');
console.log('----------------------');
console.log(`Pages scanned: ${results.length}`);
console.log(`Crawlability/Indexation issues: high=${highImpactCount}, medium=${mediumImpactCount}, low=${lowImpactCount}`);

console.log('\nTop gaps (impact-ranked):');
for (const issue of ranked) {
  if (issue.severity === 'low') continue;
  console.log(`- [${issue.severity}] ${issue.area}: ${issue.finding}`);
  console.log(`  impact: ${issue.impact}`);
}

console.log('\nTarget-query benchmark:');
for (const result of results) {
  console.log(`\nPage: /${result.file.replace('src/pages/', '').replace('.astro', '')}`);
  for (const query of result.queryBench) {
    console.log(`  - ${query.query}: ${query.coverage}/100 (${query.mappingStatus})`);
    if (query.coverage < 70) {
      console.log(`    gap: ${query.topGap}`);
    }
  }
}

const unresolvedHigh = ranked.filter((item) => item.severity === 'high');
if (highImpactCount > 0) {
  console.log('\nCritical status: FAIL');
  console.log(`Highest-leverage fix candidate: ${unresolvedHigh[0]?.finding}`);
} else {
  console.log('\nCritical status: PASS (no unresolved high-impact issues).');
}

const residualHighGapPages = results.flatMap((r) => r.unmapped);
if (residualHighGapPages.length === 0) {
  console.log('Priority query mapping: all mapped to answer-ready pages.');
} else {
  const uniqueQueries = [...new Set(residualHighGapPages.map((item) => item.query))];
  console.log(`Priority query mapping gaps remaining: ${uniqueQueries.length}`);
  for (const q of uniqueQueries) {
    console.log(`  - ${q}`);
  }
}
