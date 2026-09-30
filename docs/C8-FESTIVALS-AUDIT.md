# C8 — Bihar festivals, fairs and religious traditions

Implemented and locally verified: 27 September 2026.

## Delivered scope

30 profiles: all 19 requested festivals, all nine requested fairs, the preserved Madhushravani profile and a Bihar Diwas civic/state-festival profile. The original nine record IDs remain stable for existing culture links and the current-data registry.

### Festival profiles

Chhath Puja; Holi / Fagua; Durga Puja; Diwali; Sama-Chakeva; Jitiya; Makar Sankranti; Saraswati Puja; Mahashivratri; Ram Navami; Hartalika Teej; Bihula-Bishari; Buddha Purnima; Mahavir Jayanti; Guru Gobind Singh Prakash Parv; Eid-ul-Fitr; Eid-ul-Adha; Muharram / Ashura; Christmas. Also Madhushravani and Bihar Diwas.

### Fair profiles

Sonepur Mela; Rajgir Mahotsav; Shravani Mela; Vaishali Mahotsav; Bodh Mahotsav; Pitrapaksha Mela; Rajgir Malmas Mela; Mandar / Bounsi Mela; Kako Urs / Sufi Festival.

## Routes and discovery

- `/festivals`, `/festivals/religious`, `/festivals/fairs`, `/festivals/seasonal`.
- Thirty canonical detail routes under `/festivals/:slug`.
- Chhath: `/festivals/chhath-puja`; Holi: `/festivals/holi`; Bihula: `/festivals/bihula-bishari`; Pitrapaksha: `/festivals/pitrapaksha-mela`.
- Existing `/culture/festivals` and `/culture/festivals/:slug` links resolve with client-side replacement navigation; query strings and anchors are preserved.
- Legacy names including `chhath`, `fagua`, `pitru-paksha`, `pitrapaksha`, `shravani` and `bihula-bishahari` resolve to the same records, not duplicate profiles.
- Header, footer, culture preview and global search point to the new directory/canonicals.
- Hindi/English aliases tested: छठ, Chhath, छठ पूजा, सामा चकेवा, होली, जितिया, सोनपुर मेला.
- URL-backed search, faith/cultural-context, region, season/calendar and approximate-month filters; clear filters, no-results recovery, browser navigation and direct refresh.

## Page experience

Hero image, five quick facts, overview, history, attributed religious narratives, rituals, foods, music, crafts/dress, places, responsible travel, changing traditions, gallery, related festivals, cross-module links and sources.

Chhath adds an accessible four-day timeline: Nahay Khay, Kharna, Sandhya Arghya and Usha Arghya. Opening one day closes the previous day; activating an open day closes it. Keyboard activation is supported. The deeper content covers origins and evidence limits, sun/Chhathi Maiya traditions, Kosi, bamboo craft, thekua/prasad, public ghats, environmental context, family labour, social inclusion and diaspora observance. Three distinct Chhath images are included.

Holi adds Holika/Prahlad narrative attribution, Holika Dahan, consent in colour play, Bhojpuri/Maithili/Magahi song contexts and malpua, gujiya, dahi and thandai. Sama-Chakeva distinguishes seasonal bird imagery from wildlife evidence. Bihula-Bishari distinguishes Manasa folklore from history and medical claims.

## Media

17 generated illustrations, each with 1440px and 640px WebP versions: 34 files, 4,004,052 bytes total. Individual files remain below 350 KB. Card/gallery images are lazy-loaded, dimensioned and responsive; the hero is prioritised.

Files are under `public/images/festivals/`:

- `chhath/chhath-hero.webp`, `chhath-arghya.webp`, `chhath-thekua.webp`.
- `holi/holi-hero.webp`, `durga/durga-hero.webp`, `diwali/diwali-hero.webp`.
- `sama-chakeva/sama-chakeva-hero.webp`, `jitiya/jitiya-hero.webp`.
- `sonepur/sonepur-hero.webp`, `rajgir/rajgir-hero.webp`.
- `islamic/islamic-hero.webp`, `sikh/sikh-hero.webp`, `christmas/christmas-hero.webp`.
- `buddhist-jain/buddhist-jain-hero.webp`, `saraswati/saraswati-hero.webp`, `remembrance/remembrance-hero.webp`, `sankranti/sankranti-hero.webp`.

Each has a matching `-small.webp` version. Some generic cultural settings are intentionally shared between related pages; captions do not identify them as a real venue or ceremony.

The imagegen skill informed generation, inspection, provenance and disclosure. Tool mode: built-in image generation; no CLI/API-key workflow. Full prompts, original generated file locations and asset mapping are preserved in `docs/C8-IMAGE-PROMPTS.json`. Original PNGs remain untouched outside the repository. `scripts/optimize-festival-images.cjs` uses Sharp installed only in the ignored local tools directory; Sharp was not added to application dependencies.

All media is visibly labelled AI-generated, with alt text and credit. None is documentary evidence. No unlicensed audio or complete copyrighted song lyrics were added.

## SEO and production HTML

- Unique titles, descriptions, canonical URLs, OpenGraph/Twitter images, Article/CollectionPage JSON-LD and breadcrumb JSON-LD.
- Filtered client views and unknown festival details are noindex; only canonical public routes enter the sitemap.
- Build produces 34 festival HTML documents containing metadata and readable article/directory content before JavaScript. React then renders the interactive version.
- Exact Vercel rewrites serve those documents at clean URLs. `vite.config.mjs` mirrors these exact rewrites for local production preview; other portal routes retain the existing SPA fallback.
- Build order: sitemap → Vite bundle → festival prerender. The current full-site sitemap contains 590 URLs, including the 34 festival canonicals and excluding their old festival aliases.
- A legacy link to an unavailable Dev Sun Temple detail page now uses Aurangabad district context; the old `/history/magadha` link resolves to the published `/history/magadh` route.

## Verification

| Check | Result |
| --- | --- |
| `npm run validate:festivals` | Passed, 2,826 checks; no duplicate IDs, missing images or broken checked references |
| `npm run validate:culture-all` | Passed, 76 culture-system records |
| `npm run validate:portal` | Passed, all 14 aggregate validators; existing warnings noted below |
| `npm run build` | Passed, including 34 prerendered festival documents |
| `npm run validate:festival-html` | Passed: static content, JSON-LD, metadata, files and hosting rewrites |
| Festival development browser suite | Passed, 322 checks |
| Festival production browser suite with `--production` | Passed, 390 checks, including raw-HTML crawler checks |
| Navigation regression suite | Passed: 22 dropdown links, exclusivity, keyboard, mobile focus trap, close and resize cleanup |
| `git diff --check` | Passed; repository line-ending notices only |

Responsive browser sizes: 1440, 1280, 1024, 768, 500, 430, 390, 360 and 320px. No horizontal overflow on the tested directory, Chhath and long-title Sikh profile. All 34 canonical pages render a single H1, correct metadata and a loaded hero. Filter typing, reset, categories, legacy aliases, hashes, unknown detail, timeline, source disclosure and reduced-motion interaction were exercised. No uncaught runtime or console errors in the festival suites.

Screenshots visually reviewed: `.g9-browser-audit/c8/directory-1440.png`, `directory-390.png`, `chhath-1440.png`, `chhath-390.png`. These local audit artifacts are ignored by Git.

The broader navigation test exposed a media-query race: a late resize event could close a just-opened mobile panel. Entering mobile layout now preserves that new panel while clearing the old desktop group; returning to desktop still closes and releases the dialog. Tests pass without adding a delay to hide the race.

### Repeat locally

```text
npm run validate:festivals
npm run validate:portal
npm run build
npm run validate:festival-html
npm run preview -- --host 127.0.0.1 --port 5179 --strictPort
node scripts/test-festivals.cjs http://127.0.0.1:5179 --production
node scripts/test-navigation.cjs http://127.0.0.1:5179
```

Browser tests use installed Chrome/Edge with an isolated temporary profile. The data-module loader requires a Node version supporting synchronous module hooks; this run used Node 24.

## Editorial and release boundaries

- Cultural interpretation is not religious promotion or an instruction to fast, perform a ritual or adopt a belief. Mourning, civic programmes and religious celebrations remain distinct.
- New long-form profiles primarily use English prose with Hindi titles/navigation; legacy profiles and the expanded Chhath/Holi sections retain the existing bilingual/Hindi style. This is not a complete Hindi-only translation release.
- Annually changing dates, permissions, prices, traffic plans and artist line-ups are not invented. Islamic moving calendars and intercalary/organiser-dependent events have no speculative fixed-month tags. Existing central current-event data is reused, with availability/freshness messaging.
- The validator checks source presence and URL structure, not continuous external-source uptime or independent scholarly certification of every claim. Source lists include official cultural pages and explicitly dated event editions.
- Existing portal warnings remain outside C8: legacy tourism superlatives/category normalisation, three stale airport records, G7 political-history/live-roster coverage gaps, a large unrelated homepage image and legacy CSS overrides. Passing the portal validator does not certify those separate phases as fully complete.
- No deployment, Google indexing verification or advertising approval was performed or implied.
