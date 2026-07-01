# Premium Portfolio (Next.js + Contentful)

Story-driven portfolio built with:

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui primitives
- Framer Motion (restrained motion system)
- Contentful CMS (projects, experience, skills, about, contact, settings, images)
- Dynamic OG image, sitemap, robots, and ISR (time-based revalidation)

## Requirements

- Node.js 20.9.0+
- npm 10+

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL (used for metadata, sitemap, OG)
- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` — Contentful space ID
- `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN` — Content Delivery API token

> Without the two `CONTENTFUL` vars, the Contentful client is skipped and the
> site renders the seed content in [`lib/site-config.ts`](lib/site-config.ts),
> so the app runs locally with zero CMS setup.

4. Run the app:

```bash
npm run dev
```

## Content Model

The content types consumed by the app are typed in
[`lib/contentful/types.ts`](lib/contentful/types.ts) and fetched in
[`lib/contentful/queries.ts`](lib/contentful/queries.ts):

- `settings`
- `about`
- `project`
- `experience`
- `skills`
- `contact`
- `mediaImage`

See [`docs/contentful-content-model.md`](docs/contentful-content-model.md) for
the full authoring reference — every field, its Contentful type, and a JSON
example per content type.

## Revalidation

Pages use time-based ISR via `export const revalidate = 120`
(see [`app/page.tsx`](app/page.tsx) and
[`app/work/[slug]/page.tsx`](app/work/[slug]/page.tsx)), so published CMS
changes appear within ~2 minutes without a redeploy. There is no webhook route
yet; if you want instant revalidation on publish, add a Contentful webhook
pointing at a `/api/revalidate` route handler and call `revalidatePath` /
`revalidateTag` from it.

## Deployment (Vercel)

1. Import this repo into Vercel.
2. Add the same environment variables from `.env.local`.
3. Deploy.

Recommended:

- Enable analytics + speed insights.
- Keep images in Contentful for automatic optimization via `next/image`.
