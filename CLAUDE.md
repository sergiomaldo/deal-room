# Deal Room

Two-party async contract negotiation with weighted compromise algorithm.

**Stack:** Next.js 14 | TypeScript | Tailwind | shadcn/ui | tRPC | PostgreSQL + Prisma | NextAuth

## Key Paths
```
/prisma/schema.prisma                      # Data model
/src/server/routers/                       # tRPC routers
/src/server/services/compromise/engine.ts  # Compromise algorithm
/src/server/services/document/             # PDF generation
/Users/sme/NEL/skills/                     # Contract templates (external)
```

## Core Concepts
- **Auth:** Google OAuth + Magic Link; Admin requires TOTP 2FA (`ADMIN_EMAIL` env var)
- **Skills:** NDA, DPA, MSA, SaaS templates with `clauses.json` containing bias/jurisdiction config
- **Governing Law:** CALIFORNIA | ENGLAND_WALES | SPAIN (set at deal creation, affects clause availability)
- **Compromise:** `stake = (priority/5 × 0.4) + ((5-flexibility)/5 × 0.3) + (|bias| × 0.3)`
- **Flow:** Create → Invite → Both submit → Algorithm suggests → Accept/Reject/Counter per clause → Sign
- **PDF:** `GET /api/deals/[id]/document` (requires AGREED/SIGNING/COMPLETED status)

## UI
Brutalist: dark bg (#1c1f37), teal accent (#13e9d1), sharp corners

## Enums
GoverningLaw: CALIFORNIA, ENGLAND_WALES, SPAIN
DealRoomStatus: DRAFT, AWAITING_RESPONSE, NEGOTIATING, AGREED, SIGNING, COMPLETED, CANCELLED
ClauseStatus: PENDING, DIVERGENT, SUGGESTED, AGREED | ProposalStatus: PENDING, ACCEPTED, REJECTED, SUPERSEDED

## Commands
```bash
npx prisma generate && npx prisma db push  # After schema changes
npx prisma db seed                          # Load skills
npm run dev                                 # Port 3000
```

## Environment
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/dealroom
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
SKILLS_DIR=/Users/sme/NEL/skills
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAIL=admin@example.com
```
