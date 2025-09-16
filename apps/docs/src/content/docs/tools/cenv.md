---
title: cenv
---

## Hva er cenv?

`cenv` (check-env) er et internt CLI vertkøy som brukes for validering av .env filer. Det bruker enkel formattering i .env filen gjennom kommentarer for å generere et skjema for validering.

## Installer cenv

Gå enten til [github og last ned en release binary](https://github.com/echo-webkom/cenv), eller kjør kommandoen:

```sh
curl -fsSL https://raw.githubusercontent.com/echo-webkom/cenv/refs/heads/main/install.sh | bash
```

## Bruk

Referer til dokumentasjon [på github](https://github.com/echo-webkom/cenv).

### Kommandoer

Liste med de mest brukte kommandoene:

- `cenv check`: skjekk om .env filen din matcher skjema
- `cenv fix`: fix .env filen din så den matcher skjema, vanlig å gjøre etter man puller eller kloner
- `cenv update`: oppdater skjema til å matche .env fil
- `cenv upgrade`: last ned nyeste cenv versjon.
