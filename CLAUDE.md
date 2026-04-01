# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Payload CMS ecommerce site (Next.js 16 + Payload 3.81) for Laura Beckart. Uses the `@payloadcms/plugin-ecommerce` plugin with Stripe payments, D1 SQLite database adapter, and Tailwind CSS v4 with shadcn/ui components.

## Commands

```bash
pnpm dev                    # Start dev server (localhost:3000)
pnpm build                  # Production build (needs NODE_OPTIONS for memory)
pnpm lint                   # ESLint (next/core-web-vitals + next/typescript)
pnpm lint:fix               # ESLint with auto-fix
pnpm test:int               # Integration tests (Vitest, jsdom)
pnpm test:e2e               # E2E tests (Playwright, Chromium)
pnpm test                   # Run both int + e2e
pnpm generate:types         # Regenerate payload-types.ts after schema changes
pnpm generate:importmap     # Regenerate import map after adding/modifying admin components
pnpm payload migrate:create # Create a new DB migration
pnpm payload migrate        # Run pending migrations
pnpm stripe-webhooks        # Forward Stripe webhooks to localhost:3000
```

To run a single integration test: `pnpm test:int -- tests/int/api.int.spec.ts`
To run a single E2E test: `pnpm test:e2e -- tests/e2e/frontend.e2e.spec.ts`

After modifying collection schemas, always run `pnpm generate:types`.
After creating or modifying admin panel components referenced by path, run `pnpm generate:importmap`.

## Architecture

### Route Groups (Next.js App Router)

- `src/app/(app)/` - Frontend website routes (shop, checkout, account, products, auth pages)
- `src/app/(payload)/` - Payload admin panel and API routes (auto-generated)

### Payload Collections & Globals

Collections defined in `src/collections/`: Users, Pages, Categories, Media. Products, Variants, Carts, Addresses, Orders, and Transactions are added by `@payloadcms/plugin-ecommerce`.

Globals defined in `src/globals/`: Header, Footer.

Config entry point: `src/payload.config.ts` (uses `sqliteD1Adapter` for D1 SQLite).

### Plugins (src/plugins/index.ts)

Three plugins configured:
1. **seoPlugin** - SEO fields on products and pages
2. **formBuilderPlugin** - Contact forms with Lexical editor
3. **ecommercePlugin** - Products, variants, carts, orders, transactions, Stripe payments

The ecommerce plugin's collections are configured via overrides (e.g., `ProductsCollection` in `src/collections/Products/`).

### Access Control (src/access/)

Role-based: `admin` and `customer` roles. Access functions include `adminOnly`, `adminOrSelf`, `adminOrPublishedStatus`, `isDocumentOwner`, `publicAccess`, etc. Guest checkout uses `accessToken` (UUID) for secure order lookup.

### Key Directories

- `src/blocks/` - Layout builder blocks (Archive, Banner, Carousel, CallToAction, Code, Content, Form, MediaBlock, ThreeItemGrid)
- `src/components/` - React components (frontend UI, forms, checkout, product display)
- `src/heros/` - Hero section variants (HighImpact, MediumImpact, LowImpact)
- `src/providers/` - React context providers (Auth, Theme, HeaderTheme)
- `src/hooks/` - Shared Payload hooks
- `src/fields/` - Reusable field configs (e.g., hero field)
- `src/utilities/` - Shared utilities (URL helpers, formatting, deep merge)
- `src/endpoints/seed/` - Database seed data

### Styling

Tailwind CSS v4 with shadcn/ui (default style, slate base color, CSS variables). Global CSS at `src/app/(app)/globals.css`. Utility alias: `@/utilities/cn` (clsx + tailwind-merge).

### Path Aliases

- `@/*` maps to `src/*`
- `@payload-config` maps to `src/payload.config.ts`
- `@/payload-types` maps to `src/payload-types.ts`

## Payload CMS Conventions

Refer to `AGENTS.md` for comprehensive Payload CMS patterns. Key rules:

- **Local API**: Always set `overrideAccess: false` when passing `user` to operations
- **Hooks**: Always pass `req` to nested operations for transaction safety
- **Hook loops**: Use `context` flags to prevent infinite recursion
- **Components**: Admin components are referenced by file path string (not imports), use `#ExportName` for named exports
- **TypeScript validation**: Run `tsc --noEmit` to check after code changes

## Environment Variables

Required: `PAYLOAD_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOKS_SIGNING_SECRET`, `NEXT_PUBLIC_SERVER_URL`. See `.env.example` for full list.
