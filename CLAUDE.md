# Deal Room

Two-party async contract negotiation with weighted compromise algorithm.

**Stack:** Next.js 14 | TypeScript | tRPC | PostgreSQL + Prisma | NextAuth

## Key Paths
```
prisma/schema.prisma            # Data model
src/server/routers/             # tRPC routers
src/server/services/skills/     # Skill loading & i18n
src/server/services/compromise/ # Compromise algorithm
docs/administration.md          # Admin, supervisor, and skills docs
```

## Administration

| Portal | URL | Auth |
|--------|-----|------|
| **Platform Admin** | `/admin` | `auth-admin.ts` → `PlatformAdmin` table |
| **Supervisor** | `/supervise` | `auth-supervisor.ts` → `Supervisor` table |

Custom NextAuth adapters map to admin tables (not User). tRPC context decodes JWT via `token.sub`.

## Private Skills

Skills live in separate `legalskills` repo. GitHub Action auto-seeds on push.

```bash
SKILLS_DIR=/path/to/legalskills npx prisma db seed  # Local
gh workflow run seed.yml                             # Trigger production
```

## Commands
```bash
npx prisma db seed              # Load skills
npm run admin:create            # Create platform admin
npm run supervisor:create       # Create supervisor
```

## Quick Reference

**Compromise:** `stake = (priority/5 × 0.4) + ((5-flexibility)/5 × 0.3) + (|bias| × 0.3)`

**Enums:** `GoverningLaw`: CALIFORNIA, ENGLAND_WALES, SPAIN
