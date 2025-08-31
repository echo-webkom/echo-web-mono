---
title: Web Applikasjon
description: echo's hovednettside bygget med Next.js 15 og React 19.
---

Web applikasjonen er echo's hovednettside som kjører på [echo.uib.no](https://echo.uib.no). Den er bygget med Next.js 15 og React 19, og fungerer som det primære grensesnittet for studenter og besøkende.

## Teknologi

### Core Stack

- **Next.js 15** med App Router
- **React 19** med server components og concurrent features
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### UI Komponenter

- **Radix UI** for accessible UI primitives
- **Lucide React** for ikoner
- **React Hook Form** for form handling
- **Motion** (Framer Motion) for animasjoner

### Data fetching

- **Server Actions** for mutations
- **Sanity Client** for CMS data
- **Drizzle ORM** for database queries

## Struktur

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (default)/         # Hovedlayout
│   │   │   ├── hjem/          # Forsiden
│   │   │   ├── for-studenter/ # Studentinnhold
│   │   │   ├── admin/         # Adminpanel
│   │   │   └── auth/          # Autentisering
│   │   └── api/               # API routes
│   ├── components/            # React komponenter
│   │   ├── ui/               # Gjenbrukbare UI komponenter
│   │   └── ...               # Feature-spesifikke komponenter
│   ├── lib/                  # Utilities og helpers
│   ├── actions/              # Server actions
│   ├── data/                 # Data fetching functions
│   └── styles/               # Global styling
├── public/                   # Statiske filer
└── tailwind.config.ts       # Tailwind konfigurasjon
```

## Hovedfunksjoner

### Forsiden (`/hjem`)

- **Arrangementer** - Kommende bedpres og sosiale arrangementer
- **Innlegg** - Nyheter og oppdateringer fra echo
- **Bursdag banner** - Feirer medlemmers bursdager
- **Hyggkom liste** - Shopping list fra hyggekomiteen

### For studenter (`/for-studenter`)

- **Arrangementer** - Browse og meld deg på arrangementer
- **Innlegg** - Les nyheter og oppdateringer
- **Stillingsannonser** - Jobb- og internshipmuligheter
- **Studentgrupper** - Oversikt over echo's undergrupper
- **Møtereferater** - Referater fra styremøter

### Autentisering (`/auth`)

- **Feide innlogging** - Integrasjon med UiB's autentiseringssystem
- **Profil** - Brukerprofilstyring
- **Tilgangsforespørsler** - Søk om tilgang til arrangementer

### Admin (`/admin`)

- **Brukerstyring** - Administrer medlemmer og rettigheter
- **Arrangementsstyring** - Opprett og administrer arrangementer
- **Tilbakemeldinger** - Se og behandle tilbakemeldinger
- **Whitelist** - Administrer tilgangsforespørsler

## Styling og tema

### Design System

Vi har ikke utviklet et særlig design system, men det er bygget på fargene du finner `globals.css` med Shadcn UI-komponenter. Du kan også sjekke ut siden (/typography)[http://localhost/typography] for å se hvordan de forskjellige komponentene ser ut.

### Komponenter

```bash
# UI komponenter i /components/ui/
- Button, Card, Dialog
- Form, Input, Select
- Table, Tabs, Toast
- Avatar, Badge, Calendar
```

## Autentisering og autorisasjon

### Feide integrasjon

- **Arctic** for OAuth2 flow
- **JOSE** for JWT token handling
- **Automatisk medlemssjekk** mot Feide sin "gruppe-API"

### Tilgangskontroll

- **Student verification** - Sjekk om bruker er UiB student
- **Medlemsskap** - Verifiser at de tar studie som echo dekker
- **Admin rettigheter** - Rolle-basert tilgang
- **Whitelist system** - Manuell godkjenning for arrangementer

## Data og state management

### Server State

- **Server Actions** for mutations (registreringer, comments)
- **Server Components** for initial data loading
- **Database queries** via Drizzle ORM

### Client State

- **TanStack Query** for caching og refetching
- **React Context** for global state
- **Local storage** for brukerpreferanser

### Forms

- **React Hook Form** med Zod validation
- **Server-side validation** i Server Actions
- **Optimistic updates** for bedre UX

## Testing

### Unit tests

```bash
# Kjør unit tests
pnpm test:unit

# Med coverage
pnpm test:unit --coverage
```

### E2E tests

- **Playwright** for end-to-end testing
- **Test database** med isolerte tester
- **Automatisk CI/CD** testing

## Deployment

### Vercel deployment

- **Automatisk deployment** ved push til main
- **Preview deployments** for pull requests
- **Environment variabler** konfigurert i Vercel dashboard

### Performance

- **Next.js optimizations** - Image optimization, code splitting
- **Caching** - ISR (Incremental Static Regeneration)

## Vanlige oppgaver

### Legge til ny side

```typescript
// 1. Opprett side i app/(default)/ny-side/page.tsx
export default function NySide() {
  return <div>Ny side innhold</div>;
}

// 2. Legg til i navigasjon hvis nødvendig
// 3. Oppdater sitemap.ts
```

### Opprette ny komponent

```typescript
// components/ny-komponent.tsx
type NyKomponentProps = {
  // Props her
};

export const NyKomponent = ({ }: NyKomponentProps) => {
  return (
    <div className="p-4">
      {/* Komponent innhold */}
    </div>
  );
};
```

### Server Action

```typescript
// actions/ny-action.ts
"use server";

import { db } from "@echo-webkom/db";

import { auth } from "@/auth/server";

export async function nyAction() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Database operasjoner her
}
```

## Kilder

### Next.js og React
- [Next.js 15 dokumentasjon](https://nextjs.org/docs)
- [React 19 beta docs](https://react.dev/blog/2024/04/25/react-19)
- [Server Actions guide](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Styling og UI
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### Autentisering
- [NextAuth.js v5](https://authjs.dev/getting-started)
- [Arctic](https://arctic.js.org/)
```
