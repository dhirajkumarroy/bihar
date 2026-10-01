# Kunwar Singh profile — implementation and evidence audit

Review: 1 October 2026. Scope: one expanded personality and the minimum related discovery/heritage integration. Existing biographies were not rewritten. This is a source-aware editorial profile, not a claim that all historical questions are settled.

## 1. Files created

- `src/data/personalities/kunwarSingh.js`: biography, facts, claims, campaigns, life timeline, places, relationships, limitations and schema.
- `src/data/personalities/kunwarSources.js`: 14 references, source groups and five evidence classifications.
- `src/pages/KunwarSinghProfilePage.jsx`: lazy profile page and accessible interactive timeline.
- `src/components/personalities/ProfilePrimitives.jsx`: shared data-independent image/rights and citation rendering.
- `src/kunwar-singh.css`: scoped additions to the existing heritage design.
- `src/data/tourism/jagdishpurFort.js`: compact verified heritage reference with a biography backlink.
- `scripts/validate-kunwar-singh.cjs`, `scripts/test-kunwar-singh.cjs`: data/static-HTML and real-browser checks.
- `docs/KUNWAR-MEDIA-REQUESTS.json`, this audit, and `public/images/personalities/kunwar-singh/credits.json`.
- Six optimized WebP files: full/small variants of three selected visuals.

## 2. Files modified

- Routing: `src/App.jsx`, `vercel.json`, `vite.config.mjs`.
- Discovery: `src/data/personalities/directory.js`, `src/pages/CatalogPages.jsx`.
- Backlinks: `src/components/history/ColonialHistoryPage.jsx`, `src/data/districts/patnaDivision.js`, `src/pages/CulturePages.jsx`.
- Tourism registration: `src/data/tourism/index.js`.
- Shared primitives only, no biography changes: `src/pages/PersonalityProfilePage.jsx`.
- Build/media/verification: `scripts/prerender-personalities.cjs`, `scripts/acquire-personality-media.cjs`, `scripts/generate-sitemap.cjs`, `scripts/validate-personalities.cjs`, `package.json`.
- Generated `public/sitemap.xml`: 671 canonical URLs.

## 3. Routes

- Expanded canonical: `/personalities/kunwar-singh` (existing generic address now serves the full profile).
- New compact heritage page: `/tourism/jagdishpur-fort`.
- `/history/1857` redirects to the existing `/history/1857-bihar`; it is not a second chapter or sitemap entry.
- `/districts/bhojpur` retains the existing redirect to `/district/bhojpur`.
- No fictional Amar Singh route or duplicate museum route was created.

## 4. Coverage and order

Breadcrumb, hero with four CTAs, nine facts, then 17 ordered sections: early life; Jagdishpur's political/estate context; Bihar before 1857; participation and age; Arrah; eight-node campaign view; Azamgarh; mobile warfare; Amar Singh; final Jagdishpur campaign; death; the four-part Ganga tradition note; significance; cultural memory; fort; museum; university.

These are followed by the 12-event interactive life/legacy timeline, eight place cards, five relationship cards, the Bihar 1857 context links, and the grouped evidence/source panel. Content is separate from presentation; approximate dates remain approximate.

## 5. Sources and how they were used

Full URLs, publisher labels, scope and review dates are in `kunwarSources.js` and the rendered page. The source keys below identify those entries.

- Government/institutional: Bhojpur district (`bhojpur`), Ministry of Culture biography (`culture`), Bihar Archives catalogue (`archives`), Ministry of Culture Arrah and Azamgarh repositories (`arrah`, `azamgarh`), Ballia district (`ballia`), Bihar Tourism (`tourism`), Bihar museum directorate (`museum`), VKSU About (`university`), Bihar IPRD historical background (`bihar-context`).
- Academic/secondary: IGNOU freedom-movement unit (`ignou`); *Marian Quest*, Vol. 10, 2020, printed pp. 233–236/PDF pp. 243–246 (`amar-study`). The latter is used narrowly for continuity under Amar Singh, not its evaluative titles or casualty figures.
- Cultural/oral: Bihar IPRD Festivals (`tradition`), Ministry of Culture Folksongs on the 1857 uprising (`folksongs`). Government hosting does not turn a legend into independent historical proof.

The Archives exhibition's descriptions of letters were reviewed; this is not a claim to have transcribed every original manuscript. Holmes's 1883 history is mediated through a modern government summary and retains a colonial perspective. No random blog is labelled a primary source.

## 6. Historical qualification and claim audit

The stable claim IDs below occur in data and rendered `data-claim` attributes. Quick facts, campaign nodes and timeline entries repeat the same evidence framework and each carries citations. Automated checks verify these associations, not the ultimate truth of a historical interpretation.

| Claim ID | Classification | References / decision |
| --- | --- | --- |
| family | SOURCE-BASED | bhojpur, culture; neutral lineage and brother relationship, no caste ranking |
| birth-precision | UNCERTAIN | bhojpur, tourism; 1777 year only, no exact day or verified birth room |
| estate-record | DOCUMENTED | archives; existence/subject of listed 1858 letters, not full-text findings |
| estate-reading | INTERPRETATION | archives; limited reading of administrative interest in property |
| estate-motive | UNCERTAIN | arrah, ignou; no single proven personal motive or invented debt amount |
| multiple-causes | SOURCE-BASED | ignou; military, revenue, political and social dimensions |
| patna-danapur | SOURCE-BASED | bihar-context, arrah; separate regional events, not one personal command |
| participation | SOURCE-BASED | culture; regional leadership and collaborators |
| age-conflict | UNCERTAIN | culture says about 80; folksongs essay says 75; discrepancy visible |
| arrah-siege | SOURCE-BASED | arrah; sepoys, local resistance, defensive position; no solo conquest claim |
| arrah-relief | SOURCE-BASED | arrah; Eyre's early-August relief and subsequent pressure |
| route-reading | INTERPRETATION | archives, azamgarh, ballia; thematic sequence, not precise travel map |
| azamgarh-phase | SOURCE-BASED | azamgarh; distinguish the pre-existing 1857 revolt from 1858 campaign |
| azamgarh-response | SOURCE-BASED | azamgarh, ballia; response and return, no fabricated duration/troop figures |
| strategy-description | SOURCE-BASED | culture, azamgarh, ballia; attributed mobile/guerrilla description |
| strategy-interpretation | INTERPRETATION | ballia, amar-study; analytical questions, not invented tactical orders |
| amar-continuation | SOURCE-BASED | culture, amar-study; resistance continued beyond Kunwar Singh's death |
| amar-scope | INTERPRETATION | amar-study; biography endpoint is not rebellion endpoint |
| final-victory | SOURCE-BASED | bhojpur; 23 April 1858, no unsupported battlefield statistics |
| return-versus-battle | INTERPRETATION | ballia gives return by 22 April, bhojpur battle on 23 April; distinguish events |
| injury-death | SOURCE-BASED | ballia, bhojpur; injury narrative and 26 April death, no medical diagnosis |
| legend-introduction | INTERPRETATION | tradition, folksongs; history versus remembered meaning |
| significance-reading | INTERPRETATION | archives, arrah, azamgarh, ignou; regional and wider contexts |
| legacy-reading | INTERPRETATION | folksongs, museum, university; commemoration is not battle evidence |
| folk-memory | POPULAR TRADITION | folksongs; songs and stories, no invented or quoted lyrics |
| vijayotsav | SOURCE-BASED | tradition; describes commemoration, not a current event schedule |
| fort-association | SOURCE-BASED | tourism; no claim that every surviving structure is original to 1857 |
| museum-foundation | SOURCE-BASED | museum; 1972 institutional record, no unverified current display list |
| university-foundation | SOURCE-BASED | culture gives 1992; university About supports identity/location |
| date-conflict | UNCERTAIN | bhojpur/tradition: 23 April 1858; tourism: 24 April/1857 wording; adoption and disagreement explained |
| ganga-record | SOURCE-BASED | ballia; modern government account, not independently checked medical record |
| ganga-legend | POPULAR TRADITION | tradition; wounded-hand offering is explicitly not undisputed fact |
| ganga-meaning | INTERPRETATION | tradition, folksongs; cultural reading, no fabricated last words |
| ganga-status | UNCERTAIN | ballia, tradition; no independent confirmation established in this review |

Additional controls: timeline sort keys for broad periods are implementation details, never rendered as exact dates or emitted as birthDate. Museum/university entries are posthumous legacy, not life events. Related figures distinguish collaborator, Bihar contemporary and wider 1857 context. No invented awards, occupation, birth/death place, troop counts or battlefield coordinates.

The VKSU history/rules pages encountered during research contained inconsistent institution/location history. They were not used to derive 1992; the Ministry of Culture profile is the cited source for that year.

## 7. Legend handling

The distinct Ganga section separates historical description, popular tradition, interpretation and evidence status. The offering story is explicitly labelled POPULAR TRADITION and its independent confirmation UNCERTAIN. No medical rationale, precise amputation account or dramatic attributed dialogue was added. The labels are readable text, not color alone.

## 8. Images and rights

| Asset | Source / rights | Treatment |
| --- | --- | --- |
| kunwar-engraving | Commons `Kunvar singh.jpg`; public domain | Circa-1858 engraving, labelled **Illustrative artistic representation**, not an authenticated photograph or likeness |
| arrah-lithograph | Commons `Defence-of-Arrah-House.png`; William Tayler, public domain | 1858 colonial artwork, not a neutral eyewitness photograph |
| kunwar-memorial | Commons `Veer Kunwar Singh Memorial and statue in Deoghar 04.jpg`; Pinakpani, CC BY 4.0 | Modern statue at Deoghar, Jharkhand; location/date explicit, not presented as Jagdishpur |

All three selected files were visually inspected. Attribution links, license links, transformation notice, captions and alt text are visible. Full/small variants together total 674,478 bytes; each file is under 450 KiB. No AI imagery was generated. No Bhopal/Jagdishpur Chaman Mahal image was substituted for Bihar's fort. Local fort/museum media remains an explicit gap.

## 9. Search

All 12 requested variants are registered: वीर कुँवर सिंह; कुँवर सिंह; कुंवर सिंह; बाबू कुँवर सिंह; Babu Kunwar Singh; Kunwar Singh; Veer Kunwar Singh; Jagdishpur Kunwar Singh; 1857 Kunwar Singh; कुँवर सिंह 1857; वीर कुंवर सिंह; बाबू कुंवर सिंह.

Discovery covers personality, history, Bhojpur, fort tourism, museum and Jagdishpur. Existing canonical-route deduplication is retained. Only lightweight directory records are loaded for discovery, not the full biography module.

## 10. SEO and rendering

Exact requested title, unique bilingual description, canonical, OpenGraph, Twitter metadata, Person within Article, and BreadcrumbList. Exact birthDate is intentionally absent; deathDate is source-qualified in the visible article. No invented award/occupation/location properties.

Production and local-preview clean URLs serve prerendered HTML. The same React component/data renders static and interactive versions. Static HTML includes all timeline descriptions and citations without dead accordion buttons. Styles are resolved through Vite's manifest, including shared profile CSS; no filename assumption breaks the older profile. Both profiles remain separate lazy JS chunks. The Kunwar route chunk in the final tested build is about 16.12 kB gzip, with no added runtime dependency.

## 11. Accessibility

One H1 and one main landmark on the expanded profile; ordered H2/H3/H4 sections; wrapping breadcrumbs; meaningful alt text; visible focus; text evidence labels; reduced-motion CSS. Timeline filters use `aria-pressed`; one open event uses `aria-expanded`, associated panel IDs and `hidden`. Native buttons support Enter and Space. Source and image-rights disclosures are keyboard operable. This is targeted accessibility testing, not a claim of comprehensive assistive-technology certification.

## 12. Responsive/browser testing

Real headless Chrome against a production preview at `127.0.0.1:5183`; widths 1440, 1280, 1024, 768, 500, 430, 390, 360 and 320. Screenshots are kept under ignored `.g9-browser-audit/kunwar/` and `.g9-browser-audit/p1/`.

Checks cover overflow, hero stacking, mobile one-column facts, timeline filtering/one-open behavior, Enter/Space, visible focus, anchors below the header, image loads/credits, canonical/structured/social metadata, reduced motion, aliases, cross-module routes, redirects, browser back, all eight other personality routes, and no-JavaScript output. Hero screenshots at 1440, 390 and 320, mobile campaign/source sections and the desktop Ganga evidence section were visually inspected.

An initial new-suite run reached the regression stage then hit a test timing race during a prerender-to-client mount. The test now waits for the mounted H1 before reading it. This was a harness wait adjustment, not a suppressed application error.

Visual review also caught inherited global navigation flex styling on the desktop contents sidebar. A profile-scoped block layout restores wrapping without horizontal scrolling. Wrapped contents links now have full-width, minimum-44px hit areas instead of gaps between inline text fragments. The browser suite checks the sidebar at all nine widths and clicks the section links.

Final Kunwar suite: **240 checks, zero failures**, including zero runtime exceptions and zero console errors on the tested routes. Existing P1 browser suite: **259 checks, zero failures** (run on 1 October; its pre-existing report date field remains 30 September). Combined: **499 passing browser checks**.

## 13. Validator results

- `node scripts/validate-personalities.cjs --html`: P1 **744 checks, zero errors**; Kunwar **673 checks, zero errors**.
- `node scripts/validate-portal.cjs`: **all 17 suites passed**, zero errors; 671 canonical sitemap URLs.
- `git diff --check`: passed; Git emits the repository's LF/CRLF conversion notices.

## 14. Build result

`npm.cmd run build`: passed on the final code. Generated 34 festival pages, 75 religion pages and both expanded personality pages. An earlier build emitted a Vite plugin-timing diagnostic (most build time in plugin hooks); the final build completed without that diagnostic.

## 15. Remaining warnings

New-profile editorial limits: birth precision, age and commemorative-date differences, original manuscript transcription, independent confirmation of the Ganga legend, local fort/museum photographs and current visitor details.

Pre-existing portal audit warnings remain visible: P1 student/birthplace media and *Atmakatha* publication discrepancy; tourism category normalization and superlative review flags; stale airport operational records; politics result-table/roster/chronology coverage gaps; global `bihar-hero.png` over 2 MB; legacy `!important` usage. These unrelated items were not silently changed or described as resolved.

## 16. Assumptions and boundaries

- The latest brief and “next write” mean continue the Kunwar Singh implementation, not create the next unrelated personality.
- Jagdishpur Fort did not have a tourism record; a compact heritage reference was added for the required working link, not a speculative full visitor guide.
- `/culture/music` and `/culture/folk-traditions` were not existing canonical topics. Cultural integration uses the real `/culture` module rather than adding empty routes.
- Amar Singh and the other unexpanded related figures link to actual sources/existing history, not nonexistent profiles.
- Prior changes were already on remote main when this task began. This new work has not been committed or pushed; no deployment was performed.
