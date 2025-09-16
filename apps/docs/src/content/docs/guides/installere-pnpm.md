---
title: Installere pnpm
---

pnpm er en pakkebehandler (eller package manager) for Node.js. En package manager er et verktøy som automatiserer prosessen med å installere, oppdatere og administrere tredjepartspakker og avhengigheter i programvareutvikling. I JavaScript-økosystemet brukes pakkebehandlere til å:

- **Installere biblioteker** - Laste ned og konfigurere eksterne kodepakker
- **Håndtere versjonering** - Sikre kompatible versjoner av avhengigheter
- **Administrere avhengighetstre** - Automatisk løse komplekse relasjoner mellom pakker
- **Kjøre scripts** - Utføre bygge-, test- og utviklingsoppgaver
- **Dele kode** - Publisere egne pakker til fellesskapet

De mest populære pakkebehandlerne for Node.js er npm (standard), Yarn og pnpm. Vi bruker for det meste bare pnpm.

## Hovedfordeler med pnpm

- **Raskere installasjoner** - Gjenbruker pakker fra et globalt lager
- **Mindre diskbruk** - Unngår duplisering av node_modules
- **Strengere avhengigheter** - Forhindrer tilgang til ikke-deklarerte pakker
- **Kompatibel** - Fungerer med eksisterende npm- og Yarn-prosjekter
- **Monorepo** - pnpm er også ganske bra for å dele opp koden din i interne pakker i samme repo.

## Installasjon

Sørg for at du har installert Node.js først. Vi anbefaler å laste ned Node.js med en versjonsbehandler (version manager) som fnm eller nvm. Du kan sjekke om du har lastet ned Node.js med `node --version`.

### Via corepack (anbefalt)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Verifier installasjon

```bash
pnpm --version
```

### Via npm

Vi anbefaler ikke å laste ned pnpm på denne måten.

```bash
npm install -g pnpm
```

## Grunnleggende bruk

- `pnpm install` - Installer avhengigheter
- `pnpm add <pakke>` - Legg til ny pakke
- `pnpm dev` - Kjør development script
- `pnpm build` - Kjør build script
