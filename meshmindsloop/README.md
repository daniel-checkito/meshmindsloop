# Meshminds 3D Website

Next.js website for the Meshminds 3D printing account with modular subpages.

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Static tool pages hosted from `public/tools`

## Project structure

- `app/page.tsx` - homepage
- `app/loop/page.tsx` - Loop tool route
- `app/loop-pro/page.tsx` - Loop Pro route
- `app/gen/page.tsx` - Gen route
- `app/impossible/page.tsx` - Impossible route
- `app/character/page.tsx` - Character route
- `app/about/page.tsx` - account about page
- `app/contact/page.tsx` - contact page
- `public/tools/*.html` - individually editable tool implementations

Each subpage is split into its own file for easy editing.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy on Vercel

1. Import this repository in Vercel
2. Framework preset: Next.js (auto-detected)
3. Build command: `next build` (default)
4. Output: managed by Next.js

No custom build config is required.