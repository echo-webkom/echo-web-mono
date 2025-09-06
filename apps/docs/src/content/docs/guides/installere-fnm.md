---
title: Installere fnm
---

fnm (Fast Node Manager) er en rask og enkel versjonsbehandler for Node.js. Den lar deg enkelt installere, bytte mellom og administrere forskjellige versjoner av Node.js på systemet ditt.

## Hvorfor bruke en Node.js versjonsbehandler?

- **Flere prosjekter, forskjellige versjoner** - Ulike prosjekter kan kreve forskjellige Node.js-versjoner
- **Enkel oppgradering** - Bytt raskt mellom versjoner uten å reinstallere
- **Isolasjon** - Hver versjon har sine egne globale pakker
- **Automatisk bytte** - Kan automatisk bytte versjon basert på prosjektets `.nvmrc`-fil

## Installasjon

### Mac og Linux

#### Via Homebrew (anbefalt)

```bash
brew install fnm
```

#### Via curl

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

## Konfigurering

Etter installasjon må du konfigurere shell-en din:

### Bash/Zsh

Legg til følgende i din `~/.bashrc` eller `~/.zshrc`:

```bash
eval "$(fnm env --use-on-cd)"
```

### Fish

Legg til følgende i din `~/.config/fish/config.fish`:

```fish
fnm env --use-on-cd | source
```

## Hvoradn bruke

### Installer nyeste LTS-versjon av Node.js

```bash
fnm install --lts
```

### List tilgjengelige versjoner

```bash
fnm list-remote
```

### Installer en spesifikk versjon

```bash
fnm install 22
```

### Bytt til en versjon

```bash
fnm use 22
```

### Vis installerte versjoner

```bash
fnm list
```

### Sett standardversjon

```bash
fnm default 22
```

### Automatisk versjonsbyte

Opprett en `.nvmrc`-fil i prosjektmappen din:

```
v22
```

Når du navigerer til mappen, vil fnm automatisk bytte til riktig versjon (hvis du har konfigurert `--use-on-cd`).

## Verifiser installasjon

Etter installasjon og konfigurering:

```bash
fnm --version
node --version
npm --version
```

## Fordeler med fnm over andre versjonsbehandlere

- **Raskere** - Skrevet i Rust for optimal ytelse
- **Cross-platform** - Fungerer på Mac, Windows og Linux
- **Enkel** - Mindre kompleks enn nvm
- **Automatisk** - Kan bytte versjon basert på `.nvmrc`-filer
