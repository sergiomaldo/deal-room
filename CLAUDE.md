# Deal Room

Two-party async contract negotiation with weighted compromise algorithm.

**Stack:** Next.js 14 | TypeScript | tRPC | PostgreSQL + Prisma | NextAuth

## Key Paths
```
prisma/schema.prisma            # Data model
src/server/routers/             # tRPC routers
src/server/services/skills/     # Skill loading & i18n
src/server/services/licensing/  # Entitlement checks
docs/administration.md          # Full admin & skills docs
```

## Administration

| Portal | URL | Auth |
|--------|-----|------|
| **Platform Admin** | `/admin` | `auth-admin.ts` → `PlatformAdmin` table |
| **Supervisor** | `/supervise` | `auth-supervisor.ts` → `Supervisor` table |

## Licensed Skills

Private `legalskills` repo, auto-deployed via GitHub Action on push.

| Skill | ID |
|-------|-----|
| Founders Agreement | `com.nel.skills.founders` |
| SAFE Agreement | `com.nel.skills.safe` |

Skills with `manifest.json` require entitlement. Admin assigns at `/admin/customers`.

## Commands
```bash
SKILLS_DIR=/path/to/legalskills npx prisma db seed  # Seed skills
gh workflow run seed.yml                             # Deploy to production
npm run admin:create                                 # Create platform admin
```

## Quick Reference

**Compromise:** `stake = (priority/5 × 0.4) + ((5-flexibility)/5 × 0.3) + (|bias| × 0.3)`

**Enums:** `GoverningLaw`: CALIFORNIA, ENGLAND_WALES, SPAIN
