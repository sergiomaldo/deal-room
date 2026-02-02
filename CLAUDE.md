# Deal Room

Two-party async contract negotiation with weighted compromise algorithm.

**Stack:** Next.js 14 | TypeScript | tRPC | PostgreSQL + Prisma | NextAuth

## Key Paths
```
prisma/schema.prisma                       # Data model
src/server/routers/                        # tRPC routers
src/server/services/skills/                # Skill packages & i18n
src/server/services/licensing/             # Activation & entitlements
src/server/services/compromise/engine.ts   # Compromise algorithm
cli/commands/                              # CLI tools
docs/skills-and-licensing.md               # Full licensing docs
```

## Quick Reference

**Compromise formula:** `stake = (priority/5 × 0.4) + ((5-flexibility)/5 × 0.3) + (|bias| × 0.3)`

**Deal flow:** Create → Invite → Both submit → Algorithm suggests → Accept/Counter → Sign

**Enums:** `GoverningLaw`: CALIFORNIA, ENGLAND_WALES, SPAIN | `DealRoomStatus`: DRAFT → AWAITING_RESPONSE → NEGOTIATING → AGREED → SIGNING → COMPLETED

## Commands
```bash
npx prisma generate && npx prisma db push  # Schema changes
npx prisma db seed                          # Load skills
npm run dev                                 # Port 3000
npm run skill:list                          # List installed skills
npm run license:fingerprint                 # Machine ID for activation
```

## Environment
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
SKILLS_DIR=/path/to/skills
ADMIN_EMAIL=admin@example.com
```

See `docs/skills-and-licensing.md` for licensing system details.
