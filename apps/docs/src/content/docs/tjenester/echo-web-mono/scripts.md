---
title: Scripts
description: Custom scripts vi har for echo-web-mono repo
---

## `update-all-interactive.sh`

Oppdaterer interaktivt avhengigheter for alle workspaces i monorepoet.

```bash
# Fra root i prosjektet
./scripts/update-all-interactive.sh
```

### Hva gjør scriptet?

Dette scriptet går gjennom alle apps og packages i monorepoet og kjører `pnpm up -L -i --filter` for hver workspace. Dette lar deg interaktivt velge hvilke versjoner du vil oppdatere for hver workspace.

Dette skal gjøre det lett å oppdatere alle avhengigheter i monorepoet.

### Hvordan det fungerer

1. Scriptet lister opp alle mapper i `apps/` og `packages/`
2. Det legger også til `playwright` workspace
3. For hver workspace kjører det `pnpm up -L -i --filter=<workspace>`
4. Du får en interaktiv prompt hvor du kan velge hvilke pakker du vil oppdatere
