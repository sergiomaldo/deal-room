# Deal Room - Contract Negotiation Platform

Two-party async contract negotiation. Users select clause options with priority/flexibility, system suggests compromises via weighted algorithm.

## Tech Stack
Next.js 14 (App Router) | TypeScript | Tailwind | shadcn/ui | tRPC | PostgreSQL + Prisma | NextAuth (Google OAuth + Magic Link)

## Key Paths
```
/prisma/schema.prisma                      # Data model
/src/server/routers/                       # tRPC routers
/src/server/services/compromise/engine.ts  # Compromise algorithm
/src/server/services/document/             # PDF generation service
/src/app/api/deals/[id]/document/route.ts  # PDF download endpoint
/src/lib/totp.ts                           # TOTP 2FA utilities
/Users/sme/NEL/skills/                     # Contract templates (external)
```

## Authentication
- **Google OAuth**: Primary sign-in method
- **Magic Link**: Email-based fallback authentication
- **Admin 2FA**: TOTP-based two-factor auth required for admin access
  - Admin determined by `ADMIN_EMAIL` env var
  - First login: scan QR code to setup authenticator app
  - Subsequent logins: enter 6-digit code
  - Session valid for 4 hours (httpOnly cookie)

## Skills (Contract Templates)
4 types: NDA, DPA, MSA, SaaS. Each has `clauses.json` with options containing:
- `prosPartyA/B`, `consPartyA/B`, `biasPartyA/B` (-1 to 1)
- `jurisdictionConfig`: per-jurisdiction `{ available, warning?, note? }`

## Governing Law
Selected at deal creation (cannot change). Affects clause availability:
- **CALIFORNIA**: Non-competes unenforceable, CCPA rules
- **ENGLAND_WALES**: UK GDPR, 72-hour breach notification
- **SPAIN**: GDPR/LOPDGDD, strong employee protections

## Compromise Algorithm
```
stake = (priority/5 × 0.4) + ((5-flexibility)/5 × 0.3) + (|bias| × 0.3)
```
- Similar stakes → middle option
- Higher stake + other flexible → favor higher stake
- Global fairness pass rebalances if >15% imbalance

## Negotiation Flow
1. Initiator selects governing law + contract type → makes selections
2. Invites respondent (auto-accepts if email matches)
3. Both submit → algorithm generates suggestions
4. Per clause: **Accept**, **Reject**, or **Counter-Propose**
5. Counter-proposals can be accepted/rejected by other party
6. "New Round" regenerates suggestions incorporating counter-proposals
7. All agreed → e-signature

## PDF Export
`GET /api/deals/[id]/document` - generates downloadable contract PDF
- Auth required: user must be party to the deal
- Deal must be AGREED, SIGNING, or COMPLETED
- Uses `@react-pdf/renderer` for server-side generation
- PDF includes: parties info, governing law, numbered clauses with legal text, signature block
- Download button available on `/deals/[id]/sign` page

## UI Style
Brutalist: dark bg (#0a0a0a), lime accent (#c8ff00), sharp corners, high contrast.

## Enums
- GoverningLaw: CALIFORNIA, ENGLAND_WALES, SPAIN
- DealRoomStatus: DRAFT, AWAITING_RESPONSE, NEGOTIATING, AGREED, SIGNING, COMPLETED, CANCELLED
- ClauseStatus: PENDING, DIVERGENT, SUGGESTED, AGREED
- ProposalStatus: PENDING, ACCEPTED, REJECTED, SUPERSEDED

## Commands
```bash
npx prisma generate && npx prisma db push  # After schema changes
npx prisma db seed                          # Load skills into DB
npm run dev                                 # Dev server (port 3000)
```

## Environment
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/dealroom
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000
SKILLS_DIR=/Users/sme/NEL/skills

# Google OAuth (required for production)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Admin 2FA
ADMIN_EMAIL=admin@example.com
```
