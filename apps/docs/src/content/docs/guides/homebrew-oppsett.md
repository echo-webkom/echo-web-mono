---
title: Homebrew Oppsett
description: Installer Homebrew package manager på macOS for enkel installasjon av utviklingsverktøy.
---

Homebrew er en package manager for macOS som gjør det enkelt å installere utviklingsverktøy. Dette er essensielt for echo Webkom utvikling på Mac.

## Installer Homebrew

Kjør denne kommandoen i Terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Følg instruksjonene

Etter installasjonen vil du få instruksjoner om å legge til Homebrew i PATH:

```bash
# For Apple Silicon Macs (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel Macs
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

## Installer essensielle verktøy

```bash
# Utviklingsverktøy
brew install git
brew install pnpm
brew install docker
brew install fnm

# VSCode
brew install --cask visual-studio-code

# Andre nyttige verktøy
brew install gh              # GitHub CLI
brew install jq              # JSON processor
```

## Verifiser installasjonen

```bash
brew --version
git --version
pnpm --version
```

## Neste steg

- Følg [Git Oppsett](/guides/sette-opp-git) for Git-konfigurasjon
- Sett opp [VSCode](/guides/vscode-oppsett) med anbefalte extensions
