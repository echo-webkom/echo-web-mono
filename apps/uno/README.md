<br />
<div align="center">
  <img src="../../.github/uno-logo.svg" alt="Logo" width="180" >

  <p align="center">
    <b>Heksagonal domene-orientert backend</b>
    <br />
    <br />
  </p>
</div>

## Om Uno

Uno er echo sin backend som håndterer alt fra APIer til cron jobs, cms, og mer. Den er skrevet i Go og bruker en domene-orientert struktur.

## Kjør

Pass på at `.env` i root har alle verdier.

```sh
pnpm i
pnpm dev
```

## Struktur

Uno består av et domene (`/domain`) og flere adaptere (`/adapters`, `/infrastructure`). Domenet er kjernelogikken for alle apper, og er fullstendig frakobla noen som helst avhengigheter. Den definerer ulike ports (`/domain/ports`) som bestemmer hvordan domenet, altså kjernen, skal kunne kommunisere med utsiden. Implementasjonen av disse portene finnes (adaptere) finnes i `/adapters` og `/infrastructure`.

Adaptere skilles i outbound- og inbound adaptere. Inbound er for eksempel http request handlere som tar imot requests fra brukere og sendes _inn_ i domenet. Kjernen kan så bruke outbound ports for å utføre ulike oppgaver _utenfor_ appen, som å gjøre operasjoner på databasen.

- `/adapters`: Innward-facing adaptere som kaller på services definert av domenet
    - `/http`
        - `/router`
        - `/routes`
        - `/util`

- `/domain`: Kjernen av appen. Definerer alle interne typer og interfaces.
    - `/model`: Ulike modeller brukt av kjernen
    - `/ports`: Interface definisjoner på vertkøy som kjernen trenger
    - `/services`: Services som tar i bruk ports

- `/infrastructure`: Outward-facing adaptere for ports i domenet.
    - `/logging`: Logging utils
    - `/postgres`: Implementasjon for repo ports
    - `/telemetry`: Telemetry utils

- `/boostrap`: Initialiserer alle adaptere og gjør klar interne dependencies
- `/cmd`: Entry point
- `/config`: Global konfigurasjon, hentet fra env
- `/docs`: Konfigurasjon for Swagger
