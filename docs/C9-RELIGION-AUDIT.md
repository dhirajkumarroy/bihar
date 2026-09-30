# C9 — Religion, sacred traditions and spiritual heritage

Implementation/source-review date: 2026-09-30. Project: `D:\Project\bihar`.

This is a cultural reference module, not religious instruction or a live visitor-information service. It neither certifies religious beliefs nor ranks communities. C8 owns festival histories, ritual sequences, calendars and festival galleries. Tourism owns travel information. Geography owns hydrology.

## Publication inventory

| Requested report item | Published inventory |
| --- | --- |
| 1. Sacred places | 25 canonical records; Bodh Gaya/Mahabodhi is one record, not duplicate place pages |
| 2. Religious traditions | 14: seven main faith/local-tradition guides and seven thematic profiles |
| 3. Pilgrimage circuits | 6 editorial reading sequences; no fabricated ancient routes, mandatory order or live travel times |
| 4. Architecture | 9 source-guided architectural contexts |
| 5. Religious-history entries | 8 overlapping historical/commemorative contexts; not eight precisely dated events |
| 6. Rivers | 3 supported religious-context profiles: Ganga, Gandak and Falgu; 4 explicit documentation gaps linked to Geography |
| Additional institutions | 2: Kurji Holy Family Hospital and Patna Women’s College, historical context only |
| 7. Images | 11 licensed photographs, each with 1440px maximum-width and 640px variants: 22 WebP files, 4,022,850 bytes total |
| 8. AI illustrations | 0 new or reused AI images in C9 |
| 9. Search aliases | 135 explicit aliases, plus Hindi/English names; module-aware results retain Religion and Tourism separately |
| 10. Routes | 75: 67 record pages and 8 landing/directory pages, all prerendered |
| 11. Sources | 38 textual/institutional/heritage references; photographic source and licence links are tracked separately |

Main entry: `/religion`. Directories: `/religion/explore`, `/religion/traditions`, `/religion/sacred-places`, `/religion/pilgrimage`, `/religion/sacred-rivers`, `/religion/architecture`, `/religion/history`. The seven tradition pages and all record details use `/religion/:slug`.

`/religion/explore` exposes all three filters (tradition, content type and cultural region); topic directories constrain the content type. Query state persists in the URL. `?lang=en` switches the C9 content and metadata to English; canonical URLs remain the Hindi-led canonical paths. Static HTML is Hindi with English record names; English is an interactive display mode, not a separately indexed translation site. The surrounding legacy portal is still primarily Hindi.

## Evidence and ownership

There are 70 distinct, individually sourced claims. The seven supported classes are TRADITION, BELIEF, HISTORICAL RECORD, ARCHAEOLOGICAL EVIDENCE, TEXTUAL EVIDENCE, SCHOLARLY INTERPRETATION and LIVING CULTURAL PRACTICE. Guide pages reuse the same classified site evidence rather than maintaining conflicting copies. Editorial reading sequences are labelled as editorial, not invented religious prescriptions.

Religious regions, cultural contexts and administrative districts have separate fields. Mithila, Magadh, Ang and other reading contexts are not represented as administrative divisions. Absence of a profile is not absence of religious life.

Important editorial decisions:

- Maner Sharif is in the Sufi circuit, not the Hindu circuit suggested in one example in the brief.
- First/second Buddhist council associations are labelled as tradition, not proven by the presence of a cave or pillar.
- Dīgha Nikāya 16 is cited as textual evidence through an identified translation; the translator’s interpretation is a separate claim.
- The Lachhuar and Vaishali birthplace identifications are attributed, not adjudicated as settled archaeology. Conflicting Lachhuar foundation dates are not published as fact.
- Mundeshwari has no unsupported “oldest” ranking or definitive founding year.
- Janaki Sthan is not conflated with Punaura Dham or Janakpur in Nepal.
- Maner’s Bari Dargah and Bihar Sharif’s Badi Dargah are distinct places with distinct associations.
- The IGNCA Salhesh inventory specifies the Dusadh community in Mithila. An inventory entry is not claimed to be a UNESCO international inscription.
- No religious healing account is presented as medical evidence; sacred water is not assumed safe to drink or bathe in.
- Christian coverage is intentionally bounded to documented Patna institutions; no unsupported statewide history has been invented.

Festival and Tourism detail pages derive reverse C9 links from C9 relationship IDs. They do not import duplicated religious prose. C8 links use canonical festival slugs. Search distinguishes module-specific results even when titles are identical.

## Media review

Every photograph was visually inspected. Captions identify what is actually visible: Nalanda’s carved stone detail, Pawapuri’s interior shrine, Vishnupad’s courtyard, the tank/exterior wall at Maner and the gate at Padri Ki Haveli are not presented as complete building elevations. No photograph of another site is silently substituted for a missing image.

Application metadata: `src/data/religion/media.js`. Acquisition ledger: `public/images/religion/credits.json`. Source requests: `docs/C9-MEDIA-REQUESTS.json`. Each includes photographer credit, original/source URL, licence URL, reuse status, dimensions, review date and transformation note. Largest delivered image: 432,948 bytes. Share-alike/source attribution is visible in the UI and prerendered HTML.

The acquisition and one-off optimization scripts use the existing local C8 Sharp utility under `.g9-browser-audit/c8-tools`; this ignored utility is **not** an application or build dependency. A fresh checkout can build with the committed assets without that utility. Reacquisition requires supplying/installing Sharp separately; do not assume the ignored directory exists on another machine.

## Verification results

12. `node scripts/validate-religion.cjs`: passed, 4,360 structural/reference checks, zero errors. Missing-photo warnings are retained. This is source/classification linting, not an automated factual certification.

13. Cross-module validation passed: History (58 deep pages, 38 periods), Districts, Tourism, Culture-all, Food, Geography, Water systems, Ecology, Agriculture, Economy, Society, Governance, Current data, Politics, SEO/policies, Search and Festivals. The portal aggregate reports 665 canonical sitemap URLs. C8 data validation passed 2,826 checks for 30 profiles and 34 canonical routes.

14. Browser verification actually completed in local headless Chrome: **836 C9 checks passed**. All 75 routes passed in Hindi and English, with headings, metadata, schema, initial/deep-link HTML and hero loading checked. Interactions covered typed aliases, content-type/tradition/region filtering, persisted filter reload, reset/empty states, English breadcrumbs, gallery enlarge/close/Escape/focus restoration, C8/Tourism forward and reverse links, all 14 requested global-search regressions, keyboard filtering, gallery scrolling, reduced motion and invalid-route recovery. Six representative page layouts were checked at **1440, 1280, 1024, 768, 500, 430, 390, 360 and 320px**; no horizontal page overflow or runtime/console errors were observed. Desktop and 390/320px screenshots were captured; the desktop landing, 390px landing and 320px Mahabodhi screenshots were visually inspected. These are Chromium checks, not Safari/Firefox or manual screen-reader certification. The C8 production browser suite passed **390 checks** across all 34 routes and nine widths. Navigation passed all **23 dropdown links**, desktop exclusivity/outside-click/keyboard behavior and mobile panel/focus/Escape/resize behavior. Two initial C9 test runs stopped on test-harness readiness/DOM serialization issues; both were corrected and the complete final C9 run passed.

15. `npm.cmd run build`: actually passed, including 34 C8 and 75 C9 prerendered documents. `validate-religion-html.cjs`: passed 1,793 checks for all 75 C9 documents. `validate-festival-html.cjs`: passed all 34 C8 documents. Vercel exact rewrites and local preview route those paths to their static HTML. Unknown C9 slugs show a noindex recovery page in the SPA; the generic static-host fallback still returns HTTP 200 rather than a server-side 404.

## Remaining warnings and follow-up

16. C9 limitations: 14 sacred-place profiles lack a site-matched photograph with verified reuse rights. Religious documentation remains limited for Son, Kosi, Punpun and Bagmati; their existing Geography pages remain linked. Seemanchal sacred-place coverage needs further research. Bhojpur is an available cultural-region filter but currently has no scoped C9 profile. Mosque coverage is a source-guided architectural context, not a measured mosque inventory. Disputed dates, manuscript attribution limits and community-coverage limits remain visible in relevant records. External source URLs were reviewed editorially; the structural validator is not a live external-link uptime checker.

17. Existing warnings intentionally retained: Tourism legacy-category normalization and superlative-review warnings; stale operational-status records for Patna, Gaya and Darbhanga airports; incomplete G7 election archive/result tables, party registry, pre-1952 tenures, cabinet/coalition chronology, vote shares and live rosters; the legacy portal hero above 2 MB; and legacy CSS `!important` usage. Nothing outside C9 was represented as newly verified political or operational information.

18. Recommended next phase: a targeted editorial/media pass—source and license the missing site photographs, deepen Seemanchal/Bhojpur and river-locality documentation, obtain specialist review of contested site histories and expand institution/community coverage only where evidence supports it. This recommendation is not an assertion that the current module documents every religious community or place in Bihar.

## Reproduction

```powershell
npm.cmd run validate:religion
npm.cmd run validate:portal
npm.cmd run validate:festivals
npm.cmd run validate:food
npm.cmd run build
npm.cmd run validate:religion-html
npm.cmd run validate:festival-html
npm.cmd run preview -- --host 127.0.0.1 --port 5181 --strictPort
# In another terminal, with Chrome/Edge available:
node scripts/test-religion.cjs http://127.0.0.1:5181
node scripts/test-festivals.cjs http://127.0.0.1:5181 --production
node scripts/test-navigation.cjs http://127.0.0.1:5181
```

Screenshots are local verification artifacts under `.g9-browser-audit/c9` and `.g9-browser-audit/c8`, not public historical imagery. No deployment, commit, external account modification or live religious-service verification was performed.
