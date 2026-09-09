# Al-Maktaba — production setup

The app runs in **demo mode** (static seed catalogue, no auth) with no configuration.
Add Supabase to make publishing, auth, reuse counting, and ratings real.

## 1. Environment variables

Create `.env.local` in the project root:

```bash
# Supabase — safe to expose to the browser
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase — server only (seed script; never sent to the browser)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

For the CLI (migrations), export your access token in the shell:

```bash
export SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxx
```

Find these in the Supabase dashboard → Project Settings → API (URL, anon, service_role)
and Account → Access Tokens (CLI token).

## 2. Create the database

```bash
npm run db:link                # link the local project to your Supabase project (asks for the ref)
npm run db:push                # apply supabase/migrations/*.sql (schema, RLS, triggers)
```

Or, non-interactively:

```bash
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

## 3. Seed the catalogue

```bash
npm run seed                   # imports the 24 typed methods, sectors, roles, agents, models
```

## 4. Enable authentication

- **Email magic links** work out of the box.
- **Google**: Supabase dashboard → Authentication → Providers → Google → add your OAuth client
  ID/secret. Add the callback `https://YOUR-DOMAIN/auth/callback` to both Supabase (Site URL /
  Redirect URLs) and the Google Cloud console.

## 5. Run

```bash
npm run dev                    # or: npm run build && npm run start
```

With the env set, the header shows **Sign in**, publishing persists to Supabase attributed to the
signed-in user, and database-published methods resolve at `/library/<slug>`.

## Architecture notes

- **Schema** — `supabase/migrations/20260909120000_init.sql`: reference tables (sectors, roles,
  shared_agents, models), `profiles`, `methods`, `method_inputs`, `method_agents`,
  `method_versions`, `method_runs`, `method_ratings`. RLS on every table; author-scoped writes;
  a trigger recomputes `reuse_count` as distinct runners; a trigger auto-creates a profile on signup.
- **Clients** — `src/lib/supabase/{server,client,middleware,config}.ts`. `isSupabaseConfigured()`
  gates every DB path, so the app degrades to demo mode cleanly.
- **Write path** — `src/app/actions/methods.ts` (`publishMethod`, `recordRun`) — server actions
  that insert attributed to `auth.uid()`.
- **Read path** — `src/data/repository.ts` (`getMethodBySlug`) is an additive fallback over the
  static seed, so published methods render without a full read migration.
- **Structured inputs** — `src/lib/prompt.ts` assembles a ready-to-paste prompt from a method's
  typed inputs ({{token}} substitution). Files/images are handled client-side and never uploaded.
