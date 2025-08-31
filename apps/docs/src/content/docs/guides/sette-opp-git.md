---
title: Sette opp Git
description: Komplett guide for å sette opp Git for echo Webkom utvikling.
---

Denne guiden hjelper deg med å sette opp Git korrekt for å jobbe med echo's kodebase. Du lærer å konfigurere Git, sette opp SSH-nøkler, og følge våre arbeidsflyter.

## Forutsetninger

- Git installert på maskinen din
- GitHub-konto
- Tilgang til echo-webkom organisasjonen på GitHub

## 1. Installer Git

### macOS

```bash
# Installer via Homebrew (anbefalt)
brew install git

# Eller last ned fra git-scm.com
```

### Windows

Last ned Git for Windows fra [git-scm.com](https://git-scm.com/download/win). Dette inkluderer Git Bash som gir deg en Unix-lignende terminal på Windows.

**Anbefaling:** Vurder å bruke WSL (Windows Subsystem for Linux) for en bedre utviklingsopplevelse.

### Linux (Ubuntu/Debian/WSL)

```bash
sudo apt update
sudo apt install git
```

## 2. Konfigurer Git

Sett opp din identitet i Git med navn og e-post:

```bash
git config --global user.name "Ditt Navn"
git config --global user.email "din.epost@student.uib.no"
```

### Anbefalt konfigurasjon for echo Webkom

```bash
# Sett standard editor (valgfritt - velg din favoritt)
git config --global core.editor "code --wait"  # VS Code
# eller
git config --global core.editor "vim"          # Vim

# Forbedret diff-visning
git config --global diff.tool vscode
git config --global merge.tool vscode

# Automatisk cleanup av branches
git config --global fetch.prune true

# Bedre log-formatering
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -sb"
git config --global alias.co "checkout"
git config --global alias.br "branch"
```

## 3. Sett opp SSH-nøkler

SSH-nøkler gir sikker autentisering uten å måtte skrive inn passord hver gang.

### Generer SSH-nøkkel

Generer en SSH-nøkkel med `ed25519`-algoritmen. Du kan også legge til e-posten din med flagget `-C`. Dette er egentlig bare en kommentar, og kan være hva enn du tror gjør det lettest for deg å huske hvilken nøkkel det er.

```bash
# Generer ny SSH-nøkkel
ssh-keygen -t ed25519 -C "din.epost@eksempel.no"

# Trykk Enter for å akseptere standard filplassering
# Opprett en passphrase (anbefalt for sikkerhet)
```

### Legg til SSH-nøkkel på GitHub

1. Kopier den offentlige nøkkelen:

```bash
# macOS/Linux
cat ~/.ssh/id_ed25519.pub | pbcopy
# Windows
cat ~/.ssh/id_ed25519.pub | clip
```

> `pbcopy` og `clip` kopierer innholdet til utklippstavlen din.

2. Gå til GitHub → Settings → SSH and GPG keys
3. Klikk "New SSH key"
4. Lim inn nøkkelen og gi den et beskrivende navn (f.eks. "MacBook Pro")

## 4. Clone echo-web-mono repository

```bash
# Clone hovedrepository
git clone git@github.com:echo-webkom/echo-web-mono.git
cd echo-web-mono
```

## 5. Git arbeidsflyt for echo Webkom

### Typisk arbeidsflyt

```bash
# 1. Sørg for at main er oppdatert
git switch main
git pull

# 2. Opprett ny branch for din oppgave
git switch -c fornavn/kort-beskrivelse

# 3. Gjør endringer og commit
git add .
git commit -m "Add new functionality to profile page"

# 4. Push til ny branch
git push origin fornavn/kort-beskrivelse

# 5. Opprett Pull Request på GitHub
```

### Commit-meldinger

Vi har veldig laidback måte å lage commit-meldinger på. Så det viktigste her er bare å skrive på engelsk og i presens. F.eks "Add" ikke "Added"

## 6. Nyttige Git-kommandoer for daglig bruk

```bash
# Sjekk status
git status

# Se endringer
git diff

# Commit kun deler av filer
git add -p

# Undo siste commit (behold endringer)
git reset --soft HEAD~1

# Se commit-historikk
git log --oneline --graph

# Bytt mellom branches
git switch branch-navn

# Slett branch (etter merge)
git branch -d branch-navn

# Sync med upstream
git fetch upstream
git merge upstream/main
```

## 7. Feilsøking

### Problem: "Permission denied (publickey)"

- Sjekk at SSH-nøkkelen er lagt til på GitHub
- Verifiser SSH-agent: `ssh-add -l`
- Test tilkobling: `ssh -T git@github.com`

### Problem: Merge conflicts

```bash
# Åpne filer med konflikter i editor
# Løs konflikter manuelt
git add .
git commit -m "Resolve merge conflicts"
```

### Problem: Glemt å lage branch

```bash
# Flytt commits til ny branch
git stash                   # Lagre ustaged endringer
git switch -c ny-branch     # Opprett ny branch
git stash pop               # Gjenopprett endringer
```
