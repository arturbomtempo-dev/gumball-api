<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev`. Verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Gumball API website

The home page, documentation and contact page of the Gumball API, a free, read-only REST API about _The Amazing World of Gumball_. The API lives in `../server`.

## Stack

- Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.
- Every page is statically generated for each locale. Home and docs revalidate API data every hour through `lib/api.ts`.
- The API base URL comes from `NEXT_PUBLIC_API_URL` and defaults to the production API.

## Internationalization

- Supported locales are English (`en`, default), Brazilian Portuguese (`pt-br`) and Spanish (`es`), configured in `lib/i18n/config.ts`.
- English has no prefix (`/`, `/docs`, `/contact`); the other locales do (`/pt-br/docs`, `/es/docs`). Every page lives under `app/[lang]` and is statically generated for each locale.
- `proxy.ts` rewrites unprefixed paths to `/en/...` internally, redirects `/en/...` permanently to the unprefixed URL, and sends visitors who chose another language (the `NEXT_LOCALE` cookie) to their prefixed URL.
- `components/LanguageSwitcher` uses plain `<a>` elements: it saves the cookie and loads the new document, keeping the current `#hash`. Never switch languages with `next/link` or a client-side navigation: re-rendering the root layout in the browser breaks the inline theme `<script>` and the prefetch of rewritten routes.
- Build every internal link with `localizePath(locale, path)` and compare routes with `splitLocale(pathname)`.
- All UI text lives in typed dictionaries in `lib/i18n/dictionaries`. `en.ts` defines the `Dictionary` type and the other locales use `satisfies Dictionary`, so a missing or extra key fails the build. Never hard-code user-facing text in components.
- Write every translation natively, not word for word: Brazilian Portuguese and neutral Spanish. Keep established technical terms (id, slug, endpoint, query parameters, enum values, field names, HTTP status texts) untranslated.
- Server Components receive dictionary sections through props from pages and layouts (`getDictionary(locale)`). Client Components read `ui` strings with `useI18n()`; only the `ui` section is sent to the browser.
- Use `{placeholder}` tokens with `formatMessage()` for dynamic values. Server Actions return codes (such as `emailInvalid`), never translated text.
- Technical documentation data (fields, types, enum values, examples) lives once in `lib/docs.ts`; descriptions come from `docs` in each dictionary and `describe()` throws if one is missing.
- Each page exports `generateMetadata` with `pageMetadata()` from `lib/i18n/metadata.ts`, which sets the canonical URL, `hreflang` alternates and the Open Graph locale. `app/sitemap.ts` lists every page in every locale.
- API content (names, titles and descriptions returned by the API) stays in English; the docs say so in Portuguese and Spanish.

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

- Minimalist and professional, with a light theme by default and an optional dark theme. Colors are tokens defined on `:root` and redefined under `:root[data-theme='dark']` in `app/globals.css`. Never hard-code colors: use the token classes, including the semantic `success`, `danger`, `warning`, `highlight`, `overlay` and `shadow-elevated`.
- The theme toggle (`components/ThemeToggle`) stores the choice in `localStorage` under `gumball-api-theme` through `lib/theme.ts`. The inline `THEME_SCRIPT` in the root layout applies it before the first paint, which is why `<html>` has `suppressHydrationWarning`. The `dark:` variant targets `[data-theme='dark']`.
- Use `loading="eager"` and `fetchPriority` instead of the deprecated `priority` prop on `next/image`.
- The documentation follows the structure of the Rick and Morty API docs: a sidebar per section, the base URL, schema tables for every resource and examples for every route.
- Every endpoint has a `Try it` panel that sends a real request to the API from the browser.
- `public/logo.png` is the full-color logo, used on the home page and as the source of the favicon (`app/icon.tsx`), the Apple touch icon (`app/apple-icon.tsx`) and the social preview (`app/opengraph-image.tsx`), which are generated from it at build time. Never add copies of it.
- The header uses `components/BrandMark`, a vector line-art mark of Gumball traced from the original drawing. It inherits `currentColor`, so it follows the light and dark themes. Use it wherever the brand appears at small sizes.
- External links (including `mailto:`) open in a new tab with `target="_blank"` and `rel="noreferrer"`. Personal links, the repository and GitHub Sponsors live in `lib/site.ts`.
- `components/ScrollToTop` smoothly scrolls to the top when the route changes, except for hash links and browser back or forward navigation. Do not add `data-scroll-behavior="smooth"` to `<html>`: it makes Next.js jump to the top instantly and removes the smooth transition. The related dev-only console hint is expected.
- Below the `sm` breakpoint, the header shows `components/MobileMenu`, a hamburger menu rendered through a portal because the header's `backdrop-blur` would trap fixed-position children.
- The contact form submits to the `sendContactMessage` Server Action in `app/[lang]/contact/actions.ts`. Validation lives in `lib/contact.ts`, runs on the server and returns error codes that the form translates. Valid messages are delivered by `lib/contact-delivery.ts` through the FormSubmit AJAX endpoint, called only from the server so the service never appears in the interface. Messages are sent to the maintainer's email defined in `lib/site.ts`. Success and failure are shown with toasts, and the form keeps the typed values on failure.
- Use toasts for feedback messages: call `toast.success()` or `toast.error()` from `lib/toast.ts`; `components/Toaster` is rendered once in the root layout. Field-level validation errors stay inline under each field.
- Every clickable element shows a pointer cursor. Buttons, selects and other controls get it from `app/globals.css`; keep `cursor-pointer` on any new custom clickable element.

## Documentation content

- `lib/docs.ts` describes every resource: fields, filters, sort fields and examples. It must match the response DTOs and query DTOs in `../server/src/modules`. Update it whenever the API changes.
- Example responses are fetched from the live API at build time, so they always reflect real data.
- Content must be exclusive to _The Amazing World of Gumball_ and _The Wonderfully Weird World of Gumball_.
