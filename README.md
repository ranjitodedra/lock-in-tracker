# Lock-In — AI Job Application Tracker

Track job applications with a minimal dashboard. Paste job descriptions; AI extracts structured fields using **your ChatGPT subscription** (no app-owner API costs).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Supabase** — Auth + PostgreSQL + RLS
- **Codex device-code OAuth** — user-owned ChatGPT token for extraction (Phase 5+)
- **Vercel** — deployment target

## Getting started

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Add Supabase credentials from your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

3. Add Codex OAuth settings to `.env.local` (optional — defaults work for dev):

   ```env
   CODEX_CLIENT_ID=app_EMoamEEZ73f0CkXaXp7hrann
   CODEX_MODEL=gpt-5.5
   ```

   Requires an active **ChatGPT Plus/Pro** subscription to connect and extract.

4. Configure Supabase Auth (required for sign-in):

   - **Authentication → URL configuration**
     - Site URL: `http://localhost:3000` (use your Vercel URL in production)
     - Redirect URLs: `http://localhost:3000/auth/callback`
   - **Authentication → Providers**
     - Enable **Email** (magic link / OTP)
     - Enable **Google** and add OAuth client ID + secret from [Google Cloud Console](https://console.cloud.google.com/)

5. Install and run:

   ```bash
   npm install
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

Sign in via **Get started** (email magic link or Google). Protected routes (`/dashboard`, `/applications`, `/settings`) require authentication.

## AI extraction

1. Connect ChatGPT in **Settings** (device-code flow; requires ChatGPT Plus/Pro).
2. On **New Application** or **Edit Application**, paste a job description and click **Extract fields**.
3. Review pre-filled fields, correct as needed, then save. Manual entry always works without ChatGPT.

Extraction is **unlimited** for all users. A burst rate limit (20/minute) prevents abuse.

When you set status to **Applied** with no follow-up date, Lock-In suggests a date 8 business days out (skips weekends). You can edit it anytime.

## Polish (Phase 8)

- **Dark mode** — header toggle (light / dark / system)
- **Keyboard shortcuts** on dashboard: `/` focuses search, `n` opens new application
- **CI** — GitHub Actions runs lint, typecheck, and build on push/PR

## Database

Schema migrations live in [`supabase/migrations/`](supabase/migrations/). The linked Supabase project should have these applied (tables: `applications`, `extraction_usage`, all with RLS).

To regenerate TypeScript types after schema changes, use the Supabase CLI or dashboard type generator, then update [`src/types/database.ts`](src/types/database.ts).

## Project docs

| Document | Purpose |
|---|---|
| [docs/PROJECT_DECISIONS.md](docs/PROJECT_DECISIONS.md) | Locked MVP boundaries and architecture |
| [docs/FABLE_PROMPT.md](docs/FABLE_PROMPT.md) | Master prompt for incremental Fable builds |
| [docs/legal/PRIVACY_POLICY.md](docs/legal/PRIVACY_POLICY.md) | Privacy policy |
| [docs/legal/TERMS_OF_SERVICE.md](docs/legal/TERMS_OF_SERVICE.md) | Terms of service |

## Build phases

| Phase | Status |
|---|---|
| 0 — Scaffold | Done |
| 1 — Supabase Auth | Done |
| 2 — Database + RLS | Done |
| 3 — Dashboard shell | Done |
| 4 — Manual CRUD | Done |
| 5 — ChatGPT OAuth | Done |
| 6 — AI extraction | Done |
| 7 — Follow-up logic | Done |
| 8 — Polish | Done |

## Risks

- ChatGPT OAuth via Codex device-code flow is **experimental and unofficial** — may break if OpenAI changes access
- AI extraction can be inaccurate — always review before saving
- See [Terms](docs/legal/TERMS_OF_SERVICE.md) for full disclaimers

## License

Private / TBD
