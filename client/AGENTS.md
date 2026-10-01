<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Gumball API website

The home page, documentation and contact page of the Gumball API, a free, read-only REST API about _The Amazing World of Gumball_. The API lives in `../server`.

## Stack

- Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.
- Pages are statically rendered and revalidate API data every hour through `lib/api.ts`.
- The API base URL comes from `NEXT_PUBLIC_API_URL` and defaults to the production API.

## Code rules

- Never write comments of any kind in code.
- All code, identifiers and UI text are in English.
- Format every change with Prettier before finishing: `npm run format`. Then run `npm run lint` and `npm run build`.
- Create each component in its own PascalCase folder with an `index.tsx` file: `components/TryIt/index.tsx`.
- Declare components with a named export only: `export function TryIt() {}`. Never use `export default` for components. Next.js file conventions (`page.tsx`, `layout.tsx`, `not-found.tsx`, `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`) are the only exception, because the framework requires a default export.
- Keep components in `components/`, shared logic and data in `lib/`, and hooks in `hooks/`.
- Keep global styles and design tokens in `app/globals.css`. Use the token-based Tailwind colors (`text-muted`, `bg-surface`, `border-border`, `text-brand`) instead of hard-coded colors.
- Avoid new dependencies unless they are clearly needed.

## Design

- Minimalist, professional and light-themed. Colors are tokens on `:root`, so a dark theme can be added later by redefining them.
- The documentation follows the structure of the Rick and Morty API docs: a sidebar per section, the base URL, schema tables for every resource and examples for every route.
- Every endpoint has a `Try it` panel that sends a real request to the API from the browser.
- `public/logo.png` is the only logo file, with a transparent background. Never add copies of it: the favicon (`app/icon.tsx`), the Apple touch icon (`app/apple-icon.tsx`) and the social preview (`app/opengraph-image.tsx`) are generated from it at build time.
- Every clickable element shows a pointer cursor. Buttons, selects and other controls get it from `app/globals.css`; keep `cursor-pointer` on any new custom clickable element.

## Documentation content

- `lib/docs.ts` describes every resource: fields, filters, sort fields and examples. It must match the response DTOs and query DTOs in `../server/src/modules`. Update it whenever the API changes.
- Example responses are fetched from the live API at build time, so they always reflect real data.
- Content must be exclusive to _The Amazing World of Gumball_ and _The Wonderfully Weird World of Gumball_.
