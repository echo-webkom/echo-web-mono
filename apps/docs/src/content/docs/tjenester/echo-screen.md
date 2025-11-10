---
title: echo-screen
description: echo screen er inforskjermen på lesesalen.
---

[echo-screen](https://screen.echo-webkom.no/)

## Hardware

Skjermen kjører på en ettkortsdatamaskin som heter Rasberry Pi ([Nøyaktig modell](https://www.kjell.com/no/varemerker/raspberry-pi/data/raspberry-pi/raspberry-pi-4-model-b-ettkortsdatamaskin-2-gb-ram-p88186)). På Pi-en er det et 64GB SD kort med Pi-OS installert.

## Tailscale

Vi bruker Tailscale for å SSH inn i Pi-en. Dette tillater oss å kjøre kommandoer på Pi-en på din egen maskin. Eksempel på å koble til Pi-en:

```bash
ssh webkom@screen-pi # screen-pi vil resolve til riktig IP via Tailscale sin DNS
```

## Når skjermen ikke fungerer skikkelig

Kommandoen `refresh` kan brukes for å restarte chromeium som viser skjermen. Dette kan være nyttig å gjøre av og til når skjermen har problemer. Alternativt kan man også gå inn på Programmerbar og restarte Pi-en med tastaturet som ligger der.

Alle tilgjenglige kommander kan man se ved å kjøre `cat ~/README.md` på Pi-en. Er også mulig å legge til flere kommandoer om nødvendig i `~/.local/bin`.

## Teknologi-stack

### Frontend

- **React 19**
- **Vite** buildtool
- **Tailwind CSS** for styling
- **TypeScript** med strict type checking

### CMS og innhold

- **Sanity** For å hente arrangement
- **echo API** For å hente bursdager
- **Entur API** For å hente bane- og bussavanger på Florida [Entur docs](https://developer.entur.org/)

### Devops og deployment

- **Cloundflare Workers** for frontend deployment
- **pnpm** for package management

## Utviklingskommandoer

### Kjøre echo screen

```bash
# Start alle applikasjoner
pnpm dev
```

### Testing og kvalitet

```bash
pnpm lint        # ESLint alle pakker
pnpm format      # Prettier formatering
pnpm build       # Bygger frontend-en
```

## Environment setup

### Krever

- Node.js 22+ (anbefalt: bruk fnm/nvm)
- pnpm 9+

### Første gangs oppsett

```bash
# 1. Clone repository
git clone git@github.com:echo-webkom/echo-screen.git
cd echo-screen

# 2. Kopier environment variabler
cp .env.example .env

# 3. Installer dependencies
pnpm install

# 4. Start utvikling
pnpm dev
```

## Arbeidsflyt

### Development

1. Opprett feature branch: `git switch -c fornavn/feature-beskrivelse`
2. Start utviklingsmiljø: `pnpm dev`
3. Gjør endringer
4. Test endringer: `pnpm lint`
5. Commit og push: `git push origin branch-navn`
6. Opprett Pull Request på GitHub

### Deployment

Alt blir deployed automatisk ved push til `main`.
