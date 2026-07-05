# Contentful Content Model — Authoring Reference

This is the reference for every content type the portfolio consumes. For each section you get:

- the **Contentful content type ID** (must match exactly — the queries filter on it),
- the **fields** with their Contentful field type, whether they're required, and notes,
- a **JSON example** of the entry's `fields` you can use as a target when authoring.

> The JSON examples show the **delivery shape** (`fields`) — i.e. what comes back from the Content Delivery API and what the app's TypeScript types in [`lib/contentful/types.ts`](../lib/contentful/types.ts) expect. You author this content in the Contentful web UI; the JSON is here so you know exactly what each field should hold. Identical example values already power the offline fallbacks in [`lib/site-config.ts`](../lib/site-config.ts).

## Field type cheatsheet

| App TS type | Contentful field type | Notes |
| --- | --- | --- |
| `string` (short) | **Symbol** | Single line, ≤256 chars (title, slug, role…) |
| `string` (long) | **Text** | Multi-line / long form (summary, story…) |
| `number` | **Integer** / **Number** | `teamSize`, `featuredOrder`, `year`, skill `level` |
| `string[]` | **Array of Symbol** | tags, highlights, challenges… |
| nested object / object[] | **JSON object** | `groups`, `journey`, `links`, `socialLinks` (see note below) |
| image | **Media → Link to Asset** | `heroImage`, `portrait`, `image`… |
| `image[]` | **Array of Media** | `gallery` |
| enum | **Symbol with validation** | `mediaImage.category` |

> **Structured fields (`groups`, `journey`, `links`, `socialLinks`) → use a JSON Object field.** The app reads these as plain nested objects/arrays straight off `fields` (see [`lib/contentful/types.ts`](../lib/contentful/types.ts)) — it does **not** resolve Contentful links/includes for them. So model each as a single **JSON Object** field holding the structure shown in the example. Modelling them as linked content types instead would require changing the queries (to request `include` depth) and the TypeScript types, so it's intentionally out of scope here.

---

## 1. `settings`

Singleton. Global site + SEO metadata. Queried via `getSettings()` (`limit: 1`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `siteTitle` | Symbol | ✅ | Browser title / brand |
| `siteDescription` | Text | ✅ | Meta description |
| `ogTitle` | Symbol | — | Falls back to `siteTitle` |
| `ogDescription` | Text | — | Falls back to `siteDescription` |
| `socialLinks` | JSON Object (array) | — | `{ label, url }[]` |

```json
{
  "siteTitle": "Ruben Poveda",
  "siteDescription": "Senior iOS Engineer crafting high-scale real-time product experiences with Swift and SwiftUI.",
  "ogTitle": "Ruben Poveda · Senior iOS Engineer",
  "ogDescription": "Editorial portfolio showcasing large-scale mobile product engineering, real-time systems, and release ownership.",
  "socialLinks": [
    { "label": "LinkedIn", "url": "https://linkedin.com/in/rubenpoveda" },
    { "label": "Email", "url": "mailto:contact.rubenpm@gmail.com" }
  ]
}
```

---

## 2. `about`

Singleton. Bio, philosophy, and timeline. Queried via `getAbout()` (`limit: 1`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `heading` | Symbol | ✅ | Section headline |
| `story` | Text | ✅ | Main narrative |
| `philosophy` | Text | ✅ | Approach / values |
| `journey` | JSON Object (array) | ✅ | `{ year, event, description }[]` |
| `portrait` | Media → Asset | — | Portrait image |

```json
{
  "heading": "Building product-grade mobile systems for real-time moments.",
  "story": "I design and ship iOS experiences where correctness, speed, and product feel matter simultaneously. At Electronic Arts, I work on fan-facing products used by millions, balancing architecture quality with release velocity.",
  "philosophy": "Great mobile products are systems, not screens. My focus is reliable state, resilient concurrency, and interfaces that remain calm under peak load.",
  "journey": [
    { "year": 2020, "event": "Joined EA/Codemasters", "description": "Grew from associate engineer to senior." },
    { "year": 2023, "event": "Led high-impact initiatives", "description": "Social and realtime initiatives across mobile and web." },
    { "year": 2025, "event": "Senior ownership", "description": "Release quality, architecture direction, and mentorship." }
  ]
}
```

---

## 3. `project`

Collection. Case studies; also drives the `/work/[slug]` detail pages. Queried via `getProjects()`, `getProjectBySlug()`, `getProjectSlugs()`. Ordered by `fields.featuredOrder`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Symbol | ✅ | |
| `slug` | Symbol (unique) | ✅ | Drives `/work/<slug>` — keep URL-safe |
| `excerpt` | Text | ✅ | Card / list summary |
| `heroImage` | Media → Asset | — | Detail hero |
| `gallery` | Array of Media | — | Additional images |
| `role` | Symbol | ✅ | |
| `company` | Symbol | ✅ | |
| `teamSize` | Integer | — | |
| `technologies` | Array of Symbol | — | Tech tags |
| `challenges` | Array of Symbol | — | Bullet list |
| `contributions` | Array of Symbol | — | Bullet list |
| `outcome` | Text | ✅ | Result statement |
| `links` | JSON Object | — | `{ website?, appStore?, googlePlay? }` |
| `featuredOrder` | Integer | — | Sort key (lower = first) |
| `features` | JSON Object | ✅ | `{ heading: String, body: String}` |
| `legalCaption | Text | ✅ | text

```json
{
  "title": "Realtime Social Platform",
  "slug": "realtime-social-platform",
  "excerpt": "Comments, threaded replies, and reactions with optimistic updates and deterministic reconciliation.",
  "role": "Senior iOS Engineer",
  "company": "Electronic Arts",
  "teamSize": 8,
  "technologies": ["Swift 6", "SwiftUI", "Ably", "SignalR", "AsyncStream"],
  "challenges": [
    "Ensure live state correctness under rapidly changing match conditions.",
    "Prevent stale events from overwriting newer local or server states."
  ],
  "contributions": [
    "Designed optimistic update and rollback flows with stale-event rejection.",
    "Shipped reusable realtime primitives for comments, reactions, and thread updates.",
    "Implemented deterministic state convergence strategy covered by contract tests."
  ],
  "outcome": "Delivered reliable realtime interaction at scale, improving user trust in live social moments.",
  "links": {
    "website": "https://www.ea.com"
  },
  "featuredOrder": 1
}
```

---

## 4. `experience`

Collection. Work history entries. Queried via `getExperiences()`. Ordered by `fields.orderRank`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Symbol | ✅ | Job title |
| `company` | Symbol | ✅ | |
| `period` | Symbol | ✅ | e.g. `"Mar 2020 - Present"` |
| `summary` | Text | ✅ | |
| `highlights` | Array of Symbol | — | Bullet list |
| `image` | Media → Asset | — | Optional logo/photo |
| `orderRank` | Integer | — | Sort key (lower = first) |

```json
{
  "title": "Senior Software Engineer",
  "company": "Electronic Arts (Codemasters)",
  "period": "Mar 2020 - Present",
  "summary": "Built high-scale iOS features for millions of sports fans, owning architecture and release quality.",
  "highlights": [
    "Designed modular CLEAN architecture across Core, Domain, Data, and Presentation.",
    "Owned roughly 75% of app releases on a two-week cadence.",
    "Mentored engineers and improved AI-assisted development workflows."
  ],
  "orderRank": 1
}
```

---

## 5. `skills`

Singleton. Grouped capability map. Queried via `getSkills()` (`limit: 1`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `heading` | Symbol | ✅ | |
| `description` | Text | ✅ | |
| `groups` | JSON Object (array) | ✅ | `{ title, items: { name, level, note? }[] }[]` |

`level` is `1–5` and renders as a bar (`level * 20%`, clamped 10–100%).

```json
{
  "heading": "Capability Map",
  "description": "A systems view of strengths across product engineering, architecture, and reliable delivery.",
  "groups": [
    {
      "title": "Realtime & Concurrency",
      "items": [
        { "name": "Actor-based architecture", "level": 5, "note": "Swift 6 strict concurrency" },
        { "name": "Live state reconciliation", "level": 5, "note": "Optimistic UI + rollback" },
        { "name": "SignalR / Ably integration", "level": 4 }
      ]
    },
    {
      "title": "Architecture & Quality",
      "items": [
        { "name": "Modular CLEAN architecture", "level": 5 },
        { "name": "MVVM + coordinator patterns", "level": 5 },
        { "name": "XCTest and contract testing", "level": 4 }
      ]
    },
    {
      "title": "Product Delivery",
      "items": [
        { "name": "Release ownership", "level": 5 },
        { "name": "Analytics instrumentation", "level": 4 },
        { "name": "Cross-functional collaboration", "level": 5 }
      ]
    }
  ]
}
```

---

## 6. `contact`

Singleton. Contact section copy + details. Queried via `getContact()` (`limit: 1`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `heading` | Symbol | ✅ | |
| `description` | Text | ✅ | |
| `email` | Symbol | ✅ | |
| `location` | Symbol | ✅ | |

```json
{
  "heading": "Let us build something enduring.",
  "description": "Open to senior iOS opportunities and product-engineering roles in high-scale systems.",
  "email": "contact.rubenpm@gmail.com",
  "location": "Spain / EU Remote"
}
```

---

## 7. `mediaImage`

Collection. Categorized images (photography grid etc.). Queried via `getPhotography()` filtered on `fields.category === "photography"`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | Symbol | ✅ | |
| `category` | Symbol + validation | ✅ | **Add an "Accept only specified values" validation** with exactly: `photography`, `work`, `portrait`. The app's type is a union of these three. Only `photography` is currently queried/rendered. |
| `image` | Media → Asset | ✅ | The image |

```json
{
  "title": "Coastal long exposure, Costa Brava",
  "category": "photography",
  "image": {
    "sys": { "id": "5xYzExampleAssetId" },
    "fields": {
      "title": "Coastal long exposure",
      "file": { "url": "//images.ctfassets.net/<space>/<asset>/<hash>/coast.jpg" }
    }
  }
}
```

---

## 8. `Kicker`

Singleton. Landing/intro copy — kicker, headline, subhead, and the two CTA button labels. Queried via `getHero()` (`limit: 1`).

> **Fallback is the i18n dictionary, not `site-config.ts`.** When the `hero` entry is missing (or Contentful is unconfigured), each field falls back to `lib/i18n/dictionaries/{en,es}.json → hero`, so the section stays localized. Mark the fields **localizable** in Contentful and fill both `en-GB` and `es` values on the single entry (Contentful localizes at the field level — one entry, per-locale values — not one entry per language).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `kicker` | Symbol | ✅ | Small eyebrow label above the headline |
| `headline` | Text | ✅ | Main hero headline |
| `subhead` | Text | ✅ | Supporting paragraph |
| `ctaWork` | Symbol | ✅ | Primary button label (anchors to `#work`) |
| `ctaContact` | Symbol | ✅ | Secondary button label (anchors to `#contact`) |

```json
{
  "kicker": "Senior iOS Engineer / Swift - SwiftUI",
  "headline": "Product-grade mobile systems for realtime moments at global scale.",
  "subhead": "I craft resilient iOS experiences where live state correctness and product feel coexist. My recent work ships to millions of sports fans under peak-demand conditions.",
  "ctaWork": "Explore Selected Work",
  "ctaContact": "Start a Conversation"
}
```

---

## Asset (image) reference

Any `Media → Asset` field (e.g. `heroImage`, `portrait`, `image`, items in `gallery`) resolves to this shape. Contentful returns protocol-relative URLs (`//images.ctfassets.net/...`); [`lib/contentful/image.ts`](../lib/contentful/image.ts) prepends `https:` for you.

```json
{
  "sys": { "id": "5xYzExampleAssetId" },
  "fields": {
    "title": "Realtime social hero",
    "description": "Optional alt/description text",
    "file": {
      "url": "//images.ctfassets.net/<space>/<asset>/<hash>/hero.jpg",
      "contentType": "image/jpeg"
    }
  }
}
```

---

## Notes for authoring in Contentful

- **Content type IDs must match exactly** the strings the queries filter on: `settings`, `hero`, `about`, `project`, `experience`, `skills`, `contact`, `mediaImage`. They're case-sensitive.
- **Singletons** (`settings`, `hero`, `about`, `skills`, `contact`) — the app takes the first entry (`limit: 1`). Keep one published entry each.
- **Ordering** — `project` sorts by `featuredOrder`, `experience` by `orderRank`. The client gracefully retries without ordering if the field is missing (see [`lib/contentful/client.ts`](../lib/contentful/client.ts)), but set them to control sequence.
- **No config = fallbacks.** Without `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` / `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`, queries return `null` and the site renders the examples from [`lib/site-config.ts`](../lib/site-config.ts). Use those as your source-of-truth seed content.
