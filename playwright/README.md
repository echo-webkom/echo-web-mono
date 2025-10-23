# Docker E2E Testing

Kjører E2E testene i en Docker container som setter opp seeding osv for deg.

Kjør testene:

```bash
./scripts/run-tests.sh
```

## Problemer

Det kan hende at Docker går tom for minne når den prøver å bygge applikasjonen. For å fikse dette må du gi Docker mer minne.

### macOS med Colima

```bash
colima stop
colima start --memory 8 --cpu 4
```

> Man kan eksperimentere med andre verdier om man synes dette er mye

### Linux

_TODO_

## Kommandoer

```bash
./scripts/run-tests.sh

# Rebuild og kjør
./scripts/run-tests.sh --build

# Fjern volumes og start fresh
./scripts/run-tests.sh --clean

# Full rebuild fra scratch
./scripts/run-tests.sh --build --clean
```

## Resultater

- `playwright-report/` - Rapport fra test
- `test-results/` - Artifacts, videoer, traces

Vis rapporten:

```bash
pnpm test:report
```
