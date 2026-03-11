---
title: Installere Go
description: Installer Go på macOS og Linux for utvikling av Uno-backenden.
---

Go er programmeringsspråket som brukes i Uno-backenden. Denne guiden viser hvordan du installerer Go på macOS og Linux.

## macOS

### Via Homebrew (anbefalt)

Sørg for at du har [Homebrew installert](/guides/homebrew-oppsett), og kjør:

```bash
brew install go
```

### Legg til Go i PATH

Go installerer verktøy (som `air`, `swag` og `mockery`) i `$HOME/go/bin`. Dette må legges til i PATH slik at du kan kjøre disse verktøyene direkte fra terminalen.

Du trenger bare å følge instruksene for din shell. Om du er usikker på hvilken du bruker, kan du skrive hvilken du bruker skriv `echo $SHELL` i terminalen din.

#### Bash

Legg til følgende i `~/.bashrc`:

```bash
export PATH="$HOME/go/bin:$PATH"
```

#### Zsh

Legg til følgende i `~/.zshrc`:

```bash
export PATH="$HOME/go/bin:$PATH"
```

#### Fish

Legg til følgende i `~/.config/fish/config.fish`:

```fish
fish_add_path $HOME/go/bin
```

Husk å starte terminalen på nytt (eller kjør `source ~/.zshrc` / `source ~/.bashrc`) etter at du har gjort endringen.

## Linux (vi antar Ubuntu her)

### Installer Go via apt

```bash
sudo apt update
sudo apt install golang-go
```

:::note
`apt`-versjonen av Go kan være utdatert. Sjekk at du har en nylig versjon med `go version`. Hvis du trenger en nyere versjon, kan du laste ned den nyeste versjonen direkte fra [go.dev/dl](https://go.dev/dl/).
:::

### Legg til Go i PATH

Akkurat som på macOS må `$HOME/go/bin` legges til i PATH.

#### Bash

Legg til følgende i `~/.bashrc`:

```bash
export PATH="$HOME/go/bin:$PATH"
```

Aktiver endringen:

```bash
source ~/.bashrc
```

## Verifiser installasjonen

```bash
go version
```

Du skal se noe tilsvarende `go version go1.26.x ...`. Akkurat hvilken kan variere, men det burde være 1.26 eller høyere.
