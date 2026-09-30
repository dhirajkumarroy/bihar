# G7 implementation and source audit

## Baseline audit

The existing Vite/React portal has a legacy `/politics` TopicPage, comprehensive G8 governance records, G9 `src/data/current` freshness policies, a canonical-route-deduplicated global search index, lazy page routing, shared SEO/Breadcrumbs/PageHero/UI cards, 38 district identities, and historical modules for the colonial, JP-movement and modern periods.

Existing changes in the worktree, including the navigation repair, are preserved. Politics extends these systems rather than creating a second governance or freshness registry. No new global palette or generated politician/party-symbol images are introduced.

## Source and coverage boundaries

- Constituency names/districts/reservation: CEO Bihar's official assembly directory; parliamentary segment relationships: the **2019** State Election Management Plan, PDF pages 7–12. This is an explicitly dated boundary snapshot, not a claim that delimitation cannot change.
- Chief minister tenures: Bihar Assembly's official historical PDF. Preserve that document's grouping of terms; do not invent cabinet formation dates or turn an open-ended entry into a historical end date.
- 2025 Assembly seats: the December 2025 PIB publication explicitly attributes the table to ECI. Campaign quotations on the same page are not imported. The retired ECI results URLs returned HTTP 404 during this audit.
- CEO Bihar's October 2025 RUPP notification is a large scanned PDF. Registration/recognition must not be inferred from a party name, election participation or an old status.
- Party constitutions are sources for attributed party positions, never proof that policy claims were achieved.
- Unverified current rosters, alliances, notices and party recognition remain withheld. Historical election seats are never labelled current legislative strength.

## Verification

Implementation counts, executed validators/browser tests and remaining coverage gaps are recorded below after testing. Until then this document is an audit log, not a completion certificate.
