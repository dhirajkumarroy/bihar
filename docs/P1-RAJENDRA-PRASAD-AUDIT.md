# P1 — Dr. Rajendra Prasad biography and heritage profile

Reviewed and implemented on 30 September 2026. Route: `/personalities/rajendra-prasad`.
Scope: one expanded biography only; the other eight personality records remain unchanged generic profiles. No deployment or commit was made. Existing changes from earlier portal phases were preserved.

## 1. Files created

- `src/data/personalities/directory.js` — lightweight discovery metadata and contextual search entries.
- `src/data/personalities/rajendraPrasad.js` — biography, claims, dates, timelines, books, places, people and limitations.
- `src/data/personalities/sources.js` — 26 individually scoped institutional, primary and academic references.
- `src/data/personalities/index.js` — selected media registry and shared Person/Article schema.
- `src/pages/PersonalityProfilePage.jsx`, `src/personalities.css` — isolated biography UI and responsive styles.
- `scripts/validate-personalities.cjs`, `scripts/test-personalities.cjs` — incremental data/HTML and real-browser checks.
- `scripts/prerender-personalities.cjs` — builds HTML from the same React component and data as the client.
- `scripts/acquire-personality-media.cjs`, `scripts/research-personality-media.cjs` — optional editorial acquisition/discovery tools, not build dependencies.
- `docs/P1-MEDIA-REQUESTS.json`, this report, `public/images/personalities/rajendra-prasad/credits.json` and the local WebP assets.

The optional acquisition tool reuses the existing ignored Sharp installation at `.g9-browser-audit/c8-tools/node_modules/sharp`. Normal installs/builds do not need this tool or network image downloads. Media is already local.

## 2. Existing files modified for P1

`src/App.jsx`, `src/components/Portal.jsx`, `src/pages/CatalogPages.jsx`, `src/data/searchIndex.js`, `src/components/history/ColonialHistoryPage.jsx`, `src/data/districts/saranDarbhangaDivisions.js`, `package.json`, `scripts/generate-sitemap.cjs`, `scripts/validate-portal.cjs`, `vite.config.mjs`, `vercel.json`, and generated `public/sitemap.xml`.

The worktree was already dirty: the full Git diff includes earlier phases and is not a P1-only diff. P1 adds one exact lazy route, optional SEO parameters with backward-compatible defaults, a Siwan profile link and a biography link from the existing history article. No other biography was expanded.

## 3. Sections added

22 sourced narrative sections: early life, education, law, public life, Champaran, Gandhi association, Non-Cooperation, Civil Disobedience, Quit India, Constituent Assembly, the independence transition, adoption versus commencement, presidency, presidential periods, constitutional role, attributed values, writing, Bihar connections, Sadaqat Ashram, final years, Bharat Ratna and legacy.

Also: portrait hero, ten quick facts, contents navigation, education sequence, three presidency-period cards, three book records, interactive life timeline, five place cards, four related-person references, sources, licensing disclosures and limitations. No fictitious quotation, honorary degree, visit, current ticket price or visitor opening time was added.

## 4. Timeline events

18 life events: birth (1884), college (1902), student conference (1906), M.A. (1907), legal practice (1911–1920), Congress membership (1911), Champaran (1917), Non-Cooperation (1920), Civil Disobedience/imprisonment context (1930–1931), Quit India (1942), Assembly presidency (11 December 1946), independence (15 August 1947), adoption (26 November 1949), presidency (26 January 1950), elected periods beginning 13 May 1952 and 13 May 1957, retirement/award (13 May 1962), death (28 February 1963).

Six separate constitutional milestones: 9 December 1946, 11 December 1946, 29 August 1947, 26 November 1949, 24 January 1950 and 26 January 1950. Each event has a date or year, title, explanation and source references. Filters are buttons; opening a second event closes the first. Without JavaScript all events remain readable.

## 5. Images added and displayed

Eight selected visuals, each with large/small WebP variants: seven photographs and one document scan. The 16 selected files total **1,257,520 bytes**, not all downloaded at once. Hero is eager/high-priority; below-fold images are lazy. All have intrinsic dimensions, responsive `srcset`, alt text, caption, rights link and attribution. No AI image was used.

Two requested subject types are explicitly incomplete: student-era portrait and a verified/licensed Ziradei birthplace photograph. A later portrait is not relabeled as a young Rajendra Prasad. A redundant 1947 portrait crop remains in the acquisition ledger but is deliberately excluded from the published media registry and page.

## 6. Image sources and editorial review

| Selected asset | Provenance / rights | What it shows |
| --- | --- | --- |
| `portrait` | Archives New Zealand, via Commons; CC BY-SA 2.0 | Signed portrait associated with Walter Nash, 1958 |
| `assembly` | Commons archival file; public domain | Prasad, Nehru and Mountbatten at the midnight-session occasion, not a general view of the debating chamber |
| `broadcast` | Government Photo Division, via Commons; public domain | Food minister's radio broadcast, December 1947, before the presidency |
| `presidency` | Commons archival file; public domain | Wreath at Jammu War Memorial |
| `flag-day` | Commons archival file; public domain | Ex-servicemen Flag Day public engagement |
| `sadaqat` | Shambhavivats, via Commons; CC BY-SA 4.0 | Modern entrance/complex view, 2026; not the retirement-era room |
| `champaran` | Praanshu, via Commons; CC BY-SA 4.0 | Modern Bhitiharwa Gandhi Ashram context, not a 1917 photograph |
| `champaran-book` | Rajendra Prasad's 1928 edition, via Commons; public domain | Scan page 9: end of preface and publisher's note |

Exact file-page URLs, original URLs, credit, license links, dimensions and transformation notices are in `credits.json`. All eight published selections were visually inspected. A supposedly “1917 Champaran” candidate was rejected after its visible content conflicted with the label. Blank book-preview pages were replaced with the inspected readable page 9. A GODL candidate with an unreviewed Commons flag was not published.

## 7. Search aliases

`राजेंद्र प्रसाद`, `डॉ राजेंद्र प्रसाद`, `राजेन्द्र प्रसाद`, `Rajendra Prasad`, `Dr Rajendra Prasad`, `President Rajendra Prasad`, `First President of India`, `जीरादेई`, `Ziradei`.

All nine return the biography in data and browser tests. “Rajendra Prasad” also finds relevant history, district and place contexts. Ziradei links to a real biography place anchor and Siwan, not an invented tourism destination. Full biography prose is not imported into the search entry module.

## 8. Cross-module links

Existing History, Champaran Satyagraha, Quit India, Gandhi-in-Bihar and Rajendra Prasad history routes; Siwan, Patna, East Champaran and West Champaran districts; Patna tourism; Politics history/movements; Governance; Languages; Culture; Editorial Policy; Personalities directory.

Siwan and the existing Rajendra Prasad history page now link back to the expanded biography. Related-person references use the existing Gandhi history article and real parliamentary/archive records for Ambedkar, Nehru and Patel. No new or fake related-person routes were created. The Gandhi tourism circuit is an explicitly external Bihar Tourism document because no matching internal circuit exists.

## 9. SEO implementation

Exact requested Hindi title, unique description, canonical, OG article/image/description, Twitter large-image card, Person inside Article JSON-LD and BreadcrumbList. The schema includes birth/death, birthplace, official identity link and award. No fabricated review/rating markup.

Route is lazy-loaded. Build-time rendering reuses the actual React page, including prose, citations, credits and all timeline events. The clean URL has an exact Vercel rewrite and matching preview behavior. It works without JavaScript. Sitemap includes one personality canonical and four previously omitted cross-linked history/tourism paths, now **669 unique portal URLs**. Verify `VITE_SITE_URL` and `SITE_URL` agree when configuring a different deployment domain.

## 10. Validator result

`node scripts/validate-personalities.cjs --html`: **732 checks, 0 errors**.

Checks IDs/slugs/names, dates and chronological order, source IDs/metadata, image existence/rights/dimensions/size, internal canonical routes/anchors, related people, aliases, books, SEO/schema, static HTML and known fact-regression guards. Incremental schema applies to the one expanded profile, not future biographies. It does not pretend to prove historical truth automatically.

`node scripts/validate-portal.cjs`: **all 17 validators passed**. District audit still covers 38 districts; history audit covers 58 deep pages and 38 periods. Religion HTML: **1,793 checks / 75 documents**, passed. Festival HTML: **34 documents**, passed.

## 11. Build result

`npm.cmd run build`: **passed**. Builds Vite production assets, 34 festival pages, 75 religion pages and this biography. P1 route chunk about **88.91 kB / 19.35 kB gzip**; scoped CSS **10.80 kB / 2.99 kB gzip**. Shared portal bundles remain a separate legacy performance concern. No Lighthouse score or deployment claim is made.

## 12. Browser tests actually performed

`node scripts/test-personalities.cjs` against local production preview `http://127.0.0.1:5182`: **259 checks, 0 failures**. Real isolated Chrome; no runtime exceptions or console errors. Covers clean-URL HTML, all aliases, all nine personality routes, cross-module links, live schemas, headings/landmark/IDs, image loads, timeline filters/exclusivity, keyboard controls, credit disclosure, anchors, reduced motion and no-JavaScript rendering.

`node scripts/test-navigation.cjs http://127.0.0.1:5182`: passed desktop/mobile exclusivity, outside click, Escape, focus trap, resize cleanup, all 23 dropdown links, home/search and circuit anchor navigation.

`node scripts/test-festivals.cjs http://127.0.0.1:5182 --production`: **390 checks**, 34 canonical routes, nine widths, no runtime errors.

`node scripts/test-religion.cjs http://127.0.0.1:5182`: **836 checks**, all 75 routes in Hindi and English, nine widths, no runtime errors.

Screenshots and machine-readable P1 results are retained locally under `.g9-browser-audit/p1/` (ignored diagnostic artifacts). Initial test-harness issues were corrected and the full P1 suite was rerun; numbers above describe the completed passing run.

## 13. Responsive results

Passed at **1440, 1280, 1024, 768, 500, 430, 390, 360 and 320 px**. No horizontal document overflow; desktop text-left/portrait-right and mobile portrait-before-text; responsive facts, source cards, prose, books and timeline. Screenshots at 1440, 768, 390 and 320; 390 no-JavaScript screenshot. Desktop, tablet, narrow mobile and no-JavaScript hero screenshots visually inspected.

## 14. Accessibility results

Single H1, single main landmark for the new route, structured H2/H3, named links/buttons, image alt text, native credit details, `aria-pressed` filters, `aria-expanded`/`aria-controls` event buttons, hidden collapsed panels and live result counts. Enter/Space and visible focus passed at every tested width; reduced-motion behavior passed.

Contrast calculations for selected theme pairs: wine/paper **9.62:1**, body/paper **13.80:1**, caption/frame **5.26:1**, white/wine **10.01:1**, small gold text/paper **6.36:1**. These are palette checks, not a whole-page certification. No screen-reader user test, Axe audit or formal WCAG certification was performed.

## 15. Remaining warnings

- Student-era and birthplace media gaps are visible on the page.
- Publication-year disagreement for Atmakatha is visible, not silently resolved.
- Some government archive PDFs can be slow or inaccessible from particular clients; no claim of continuous external-link availability.
- Prior portal warnings remain: old tourism categories/superlatives, stale airport-status records, incomplete political election archives/rosters, large legacy homepage hero and extensive old `!important` styles. P1 does not mark these resolved.
- No current opening times, admission prices or visit guarantees were added.

## 16. Facts and evidence decisions

- Bharat Ratna: **13 May 1962 notification, during his lifetime**, not posthumous. Decisive primary record: [1962 Gazette](https://www.padmaawards.gov.in/Document/pdf/Notifications/BharatRatna/1962BR.pdf).
- Assembly chair: **11 December 1946**, not after independence. Use the original Assembly proceedings over imprecise short biographies.
- Initial election **24 January 1950** versus assumption **26 January 1950**; 1952 polling, result and assumption kept distinct.
- **Two elected terms**, plus the initial 1950–1952 period; not three elected terms.
- Current Article 74 wording is not presented as the unamended 1950 text; 42nd/44th amendment caveat included.
- Atmakatha: 1947 is identified as the referenced edition, while official district material says 1946. Definitive first-publication reconciliation needs further bibliographic evidence. No invented serialization explanation.
- Exact arrest days/release durations and private anecdotes are omitted where not independently pinned down.
- Sadaqat Ashram is not incorrectly credited to Prasad alone; Mazharul Haq and Bihar Vidyapeeth context retained.

## 17. Recommended next personality

**Veer Kunwar Singh**, using the existing personality route and the already-developed 1857/Jagdishpur history and Bhojpur context. Recommendation only: no new Kunwar Singh biography was implemented in P1.
