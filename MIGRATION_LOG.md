# Migration Next.js - Log

## Statut: EN COURS

### Phase 1 - Setup ✅
- [x] Branche `feature/nextjs-migration`
- [x] package.json (Next.js 15, next-intl, @supabase/ssr)
- [x] tsconfig.json, next.config.ts
- [x] .env.local
- [x] Supabase SSR (lib/supabase/client.ts, server.ts, middleware.ts)
- [x] i18n config (src/i18n/*)
- [x] middleware.ts
- [x] app/globals.css
- [x] app/layout.tsx + QueryProvider

### Phase 2 - Layouts & Components ✅
- [x] app/[locale]/layout.tsx
- [x] Header, Footer, MobileMenu, LanguageSwitch (Next.js)
- [x] CartDrawer, CartItem, EmptyCart (Next.js)
- [ ] UI components migration

### Phase 3 - Pages Publiques ✅
- [x] Homepage + SplitScreenHero
- [x] About, FAQ, Contact
- [x] Events (Home, Gallery, Devis)
- [x] Shop (Boutique, Checkout, Success, Cancel, Commandes)

### Phase 4 - SEO ✅
- [x] sitemap.ts (dynamique, bilingue)
- [x] robots.ts (block /admin)
- [x] Metadata par page (generateMetadata)

### Phase 5 - Admin (client-side) ✅
- [x] Layout + sidebar + auth
- [x] Login, Dashboard
- [x] Products, Orders, Quotes, Categories

### Phase 6 - Tests ✅
- [x] npm install
- [x] Build successful
- [x] Pages générées:
  - SSG: Homepage, About, FAQ, Contact, Events, Devis, Gallery, Boutique, Checkout
  - Admin: Dashboard, Login, Products, Orders, Quotes, Categories
  - SEO: sitemap.xml, robots.txt

## Build Output
- First Load JS: 101 kB (shared)
- Middleware: 90.7 kB
- All routes bilingues (FR/HE)
