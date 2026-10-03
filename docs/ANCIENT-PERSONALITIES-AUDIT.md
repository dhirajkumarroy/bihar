# Ashoka, Chanakya and Aryabhata profiles

Reviewed and implemented: 3 October 2026. Scope: the three personality cards selected by the user. No unrelated biography was replaced, and no commit, push or deployment was performed.

## Delivered

| Profile | Route | Sections | Timeline entries |
| --- | --- | ---: | ---: |
| सम्राट अशोक | `/personalities/ashoka` | 10 | 5 |
| चाणक्य | `/personalities/chanakya` | 10 | 5 |
| आर्यभट | `/personalities/aryabhata` | 11 | 4 |

The original directory cards now have useful descriptions and open the expanded profiles. Hindi and English search aliases resolve to the same canonical records. The relevant history chapters link back to the biographies; profiles link to existing history, district, religion and tourism pages.

Each profile has sourced quick facts, a contents sidebar, evidence labels with explanations, reading sections, an exclusive-filter/exclusive-expansion timeline, related reading, source scopes and editorial limitations. Chanakya includes a seven-element state framework; Aryabhata includes the four sections of the Aryabhatiya and explicitly labelled modern teaching examples.

## Implementation

- Separate route wrappers and data files keep full biographies in their lazy route chunks. The shared renderer is `src/components/personalities/HistoricalProfile.jsx`.
- Shared heritage styling remains in `src/personalities.css`; new styles are scoped to `.ap-page` in `src/ancient-personalities.css`.
- All nine catalog records remain. Existing Rajendra Prasad and Kunwar Singh page data were not changed.
- Prerendering uses the same React components as the browser, with complete static timelines instead of inert interactive buttons.
- Exact clean-URL Vercel rewrites serve all three generated documents. Canonical, Open Graph, Twitter, Article/Person and breadcrumb metadata are included.
- Structured Person data deliberately omits unsupported exact birth/death dates and birthplaces.
- Eight previously omitted, existing linked routes were added to the sitemap without aliases or duplicates: total 679 canonical URLs.
- The image-acquisition script gained an explicit `--ancient` option; ordinary builds never download images.

## Editorial decisions

Ashoka's royal inscriptions are distinguished from modern analysis and later tradition. Approximate reign and Kalinga chronology remain approximate. The Kalinga declaration is not presented as an independent casualty census, and remorse is not equated with the abolition of royal coercion. Kolhua's ancient site association is distinguished from its present administrative district.

Chanakya's traditional association with Kautilya, Vishnugupta and Chandragupta is qualified. Available Arthashastra composition, the historical person, later manuscript copies and modern scholarship occupy different evidentiary categories. The disputed composition entry has `sortYear: null`; no invented year is serialized. Prescriptions in a political treatise are not treated as proof of universal Mauryan administrative practice. Unverified social-media quotations were not included.

Aryabhata's birth-year inference is not a precise birthday. Kusumapura's usual association with Pataliputra is not treated as proof of birthplace or appointment at Nalanda. Earth rotation is not equated with a complete modern heliocentric model. The profile distinguishes the approximate value of pi, historical sine computations, and separate developments in the history of zero. The 1975 satellite is explicitly modern commemoration.

Source links and their actual scope are visible on each page. Research references include IGNOU teaching units, the Göttingen GRETIL Arthashastra text, Oxford's public book description, St Andrews' MacTutor archive, Indian Academy of Sciences research records, and official ASI, museum, district and ISRO pages. Public abstracts are labelled as abstracts; complete paid books or unread full PDFs are not claimed as reviewed. Some IGNOU direct opens were intermittently unavailable; indexed institutional records and available extracts informed the review. Automated checks validate consistency, not historical truth.

## Media provenance

| Profile | Asset | Status |
| --- | --- | --- |
| Ashoka | Existing local Vaishali/Kolhua pillar photograph | Rohit Sharma, CC BY-SA 4.0; reused without generating a substitute |
| Chanakya | Later Grantha-script Arthashastra manuscript reproduction | Public domain per Commons record; explicitly not a Mauryan original or the author's handwriting |
| Aryabhata | Modern commemorative statue photograph | Public domain per Commons record; author metadata absent and disclosed; not an authenticated portrait |

Original source URLs, dimensions, captions and rights are retained in the media records. Images were visually inspected. New full-size images are approximately 84 KB and 114 KB, with small responsive variants. No AI portraits were generated. Ashoka's reused small variant is correctly declared as 640 pixels wide.

## Verification results

- `npm run build`: passed; three new full biography documents plus existing prerenders.
- `npm run validate:personalities -- --html`: 750 P1, 673 Kunwar Singh and 631 ancient-profile checks; zero errors.
- `npm run validate:portal`: all 17 suites passed; no errors.
- `npm run test:ancient-personalities`: 543 checks; zero failures.
- `npm run test:personalities`: 259 checks; zero failures.
- `npm run test:kunwar-singh`: 240 checks; zero failures.
- Browser widths: 1440, 1280, 1024, 768, 500, 430, 390, 360 and 320 pixels.
- Covered: directory descriptions and clicks, browser Back, canonical metadata, all profile aliases, live history backlinks, internal destinations, fragment targets, image-rights disclosure, responsive layouts, single-open timeline behavior, Enter/Space operation, visible focus, reduced motion and complete no-JavaScript pages.
- No runtime exceptions or console errors in the completed browser audits.
- Desktop/mobile hero and reading-section screenshots were visually inspected. Local audit screenshots and JSON reports are under the ignored `.g9-browser-audit/ancient-personalities/` directory.

The first regression run exposed a test race: a prerendered H1 could satisfy navigation before React replaced the static main element. The cross-personality assertions now wait for `#main-content[role=main] h1`, the client application's rendered landmark. No assertions were removed or loosened; the corrected suites passed.

## Existing limitations left unchanged

Portal-wide validation still reports prior warnings for incomplete earlier-profile media/source details, legacy tourism normalization and superlatives, stale airport operating-status records, political-data coverage gaps, the oversized homepage hero and legacy CSS `!important` usage. This delivery does not certify every historical claim elsewhere in the portal, resolve those unrelated warnings, or imply publication to the live domain.

To repeat the browser checks, build first, run `npm run preview -- --host 127.0.0.1 --port 5184 --strictPort`, then run `npm run test:ancient-personalities`. Set `TEST_ORIGIN=http://127.0.0.1:5184` when using that preview with the older personality test commands.
