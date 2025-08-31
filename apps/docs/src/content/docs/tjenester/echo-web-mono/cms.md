---
title: CMS (Sanity Studio)
description: echo's headless CMS bygget med Sanity.io for innholdsstyring.
---

echo CMS er en Sanity Studio installasjon som fungerer som headless CMS for echo's nettsider. Den tillater ikke-tekniske brukere å opprette og redigere innhold som arrangementer, innlegg, og andre data.

## Teknologi

### Core Stack

- **Sanity.io v4** - Headless CMS platform
- **React 19** - UI framework for Studio
- **TypeScript** - Type safety for schemas og komponenter

### Plugins

- **Vision** - GraphQL playground og query testing
- **Media** - Forbedret media library
- **Markdown** - Rich text med markdown support
- **Color Input** - Fargevelger for branding
- **Singleton Tools** - Single-instance dokumenter (banner)

## Struktur

```
apps/cms/
├── schemas/                 # Content schemas
│   ├── happening.tsx       # Arrangementer
│   ├── post.tsx           # Innlegg/nyheter
│   ├── job-ad.tsx         # Stillingsannonser
│   ├── student-group.tsx  # Studentgrupper
│   ├── banner.tsx         # Bannere
│   ├── company.tsx        # Bedrifter
│   ├── merch.tsx          # Merchandise
│   ├── movies.tsx         # Filmklubb filmer
│   └── objects/           # Gjenbrukbare objekter
├── src/
│   └── desk-structure.ts  # Studio navigation struktur
├── migrations/            # Schema migrasjoner
└── sanity.config.ts      # Studio konfigurasjon
```

## Content Types

### Hovedinnhold

#### Arrangementer (`happening`)

- **Metadata** - Tittel, beskrivelse, dato/tid
- **Registrering** - Kapasitet, påmeldingsfrist, spørsmål
- **Location** - Fysisk eller digital lokasjon
- **Bedrift** - Tilknyttet bedrift (for bedpres)
- **Bilder** - Hero image og galleri

#### Innlegg (`post`)

- **Metadata** - Tittel, forfatter, publiseringsdato
- **Innhold** - Rich text med markdown
- **Bilder** - Featured image og inline bilder
- **SEO** - Meta description og tags

#### Stillingsannonser (`job-ad`)

- **Bedrift** - Bedriftsinformasjon og logo
- **Stillingsinfo** - Tittel, beskrivelse, krav
- **Søknadsfrist** - Deadline for søknader
- **Lokasjon** - Arbeidssted

### Organisasjon

#### Studentgrupper (`student-group`)

- **Gruppeinformasjon** - Navn, beskrivelse, type
- **Medlemmer** - Gruppeleder og medlemmer
- **Kontaktinfo** - E-post og sosiale medier
- **Logo** - Gruppens logo/bilde

#### Brukerprofiler (`profile`)

- **Personinfo** - Navn, studie, årstrinn
- **Rolle** - Verv i echo
- **Kontakt** - E-post, sosiale medier
- **Profilbilde** - Avatar

### Marketing og design

#### Bannere (`banner`)

- **Visning** - Tittel, beskrivelse, CTA
- **Styling** - Farger og layout
- **Målgruppe** - Hvem som skal se banneret
- **Periode** - Når banneret skal vises

#### Statisk info (`static-info`)

- **Om echo** - Vedtekter, retningslinjer
- **Kontaktinfo** - Adresser og telefonnummer
- **Generell info** - FAQ, praktisk informasjon

## Studio-miljøer

Miljøer som `develop` og `testing` er bare tilgjengelig når du kjører Sanity lokalt på PCen din. Et annet Studio-miljø vil si hvilke data du har tilgjengelig når du kjører Sanity.

### Produksjon

- **Dataset**: `production`
- **URL**: `/prod` basepath
- **Tilgang**: Kun godkjente redaktører
- **Backup**: Automatisk daily backup

### Development

- **Dataset**: `develop`
- **URL**: `/dev` basepath
- **Tilgang**: Alle Webkom medlemmer
- **Testing**: Safe environment for utvikling

### Testing

- **Dataset**: `testing`
- **URL**: `/test` basepath
- **Tilgang**: Automatiserte tester
- **Reset**: Regelmessig reset av data

## Arbeidsflyt

### Innholdsredigering

1. **Logg inn** på Sanity Studio (localhost:3333)
2. **Velg miljø** - øverst til venstre
3. **Opprett innhold**
4. **Publiser**

### Schema utvikling

1. **Rediger schemas** i `/schemas` mappen
2. **Test lokalt** i development miljø
3. **Deploy til produksjon** etter testing

#### Eventuelt

4. **Migrer data** hvis nødvendig

Dette er om du gjør større endringer som også krever at du endrer på eksisterende data.

## Sanity Queries

### GROQ eksempler

```groq
// Hent alle arrangementer
*[_type == "happening" && date > now()] | order(date asc)

// Hent publiserte innlegg
*[_type == "post" && publishedAt <= now()] | order(publishedAt desc)

// Hent aktive stillingsannonser
*[_type == "jobAd" && deadline > now()]
```

## Custom komponenter

### Schema fields

```typescript
// Eksempel: Custom datetime picker
export const customDateTime = defineField({
  name: "customDate",
  type: "datetime",
  validation: (Rule) => Rule.required(),
  options: {
    timeStep: 15,
    calendarTodayLabel: "Today",
  },
});
```

## Deployment og drift

### Studio deployment

```bash
# Deploy til Sanity hosting
pnpm deploy

# Med spesifikk dataset
sanity deploy --dataset production
```

### Schema migrasjoner

```bash
# Generer types
pnpm typegen

# Extract schema for validation
pnpm extract
```

### GraphQL endpoint

```bash
# Deploy GraphQL API
pnpm deploy-graphql
```

## Best practices

### Schema design

- **Konsistente navn** - Bruk camelCase for fields
- **Validation** - Legg til required fields og custom validation
- **Preview** - Definer gode preview komponenter
- **Groups** - Organiser fields i logical groups

### Content strategi

- **Templates** - Opprett templates for vanlige content types
- **Media optimization** - Bruk passende bildestørrelser
- **SEO** - Fyll ut metadata for alle public content
- **Versioning** - Bruk drafts for work-in-progress

## Troubleshooting

### Schema errors

```bash
# Sjekk schema validity
pnpm extract

# Restart development server
pnpm dev
```

### Type generation issues

```bash
# Regenerer types
pnpm typegen
```

## Kilder

### Sanity.io

- [Sanity dokumentasjon](https://www.sanity.io/docs)
- [GROQ query language](https://www.sanity.io/docs/groq)
- [Schema types reference](https://www.sanity.io/docs/schema-types)
- [Sanity Studio](https://www.sanity.io/docs/sanity-studio)
- [Plugins oversikt](https://www.sanity.io/plugins)

```

```
