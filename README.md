<br>

<div align="center">
   <img src=".github/echo-logo.png" alt="" width="40%">

   <p></p>
Full-stack monorepo for nettsiden til <a href="https://echo.uib.no">echo – Linjeforeningen for informatikk</a> ved Universitetet i Bergen.

Utviklet av frivillige informatikkstudenter fra undergruppen **echo Webkom**.

<div align="center" >
  <a href="https://sanity.io" target="_blank" rel="noopener">
    <img src="https://cdn.sanity.io/images/3do82whm/next/51af00784c5addcf63ae7f0c416756acca7e63ac-353x71.svg?dl=sanity-logo.svg" width="100" alt="Powered by Sanity" />
  </a>
</div>

<br>

</div>

## Tilbakemeldinger

Har du ingen tilbakemeldinger til nettsiden?
Vi jobber hele tiden med å forbedre den,
og setter stor pris på om du sier ifra om noe er feil,
eller du har idéer til nye endringer!

Send oss gjerne en tilbakemelding via skjemaet på <https://echo.uib.no/tilbakemelding>,
eller send oss en mail på [webkom-styret@echo.uib.no](mailto:webkom-styret@echo.uib.no).

## Arkitektur

Denne full-stack monorepo-en består av flere applikasjoner og delte pakker:

### Applikasjoner (`/apps`)

- **web** - Hovednettsiden bygget med Next.js 16, React 19, Tailwind CSS og NextAuth.js
- **uno** - Backend API bygget i Go med Chi-router og hexagonal arkitektur
- **cms** - Sanity Studio for innholdsadministrasjon

### Delte pakker (`/packages`)

- **db** - Databaseskjemaer, migrasjoner og verktøy med Drizzle ORM og PostgreSQL
- **sanity** - Delte Sanity-spørringer og verktøy
- **lib** - Felles verktøy og forretningslogikk
- **email** - E-postmaler og sending-funksjonalitet
- **seeder** - Database seeding-verktøy

### Testing (`/playwright`)

- End-to-end tester med Playwright for både API og web-applikasjoner

## Hvordan kjøre?

1. **Før du starter må du passe på at det følgende er installert:**

   - [pnpm](https://pnpm.io/installation)
   - [docker](https://docs.docker.com/engine/install/)
   - [cenv](https://github.com/echo-webkom/cenv)

2. **Kopier `.env.example` til `.env` og fyll inn nødvendige verdier.**

   ```sh
   cp .env.example .env
   ```

   Kjør `cenv check` for å skjekke om alt er gjort riktig

3. **Last ned "dependencies"**

   ```sh
   pnpm install
   ```

4. **Sette opp databasen**

   ```sh
   pnpm db:setup
   ```

5. **Synce og seede databasen**

   ```sh
   pnpm seed
   ```

6. **Start utviklingsmiljøet**

   ```sh
    pnpm dev
   ```

Sidene som starter er:

- [http://localhost:3000](http://localhost:3000) for nettsiden
- [http://localhost:3333](http://localhost:3333) for Sanity Studio
- [http://localhost:8000](http://localhost:8000) for `uno` API-et vårt
- [https://local.drizzle.studio](https://local.drizzle.studio) for Drizzle Studio

> NB: "Backenden" til Drizzle vil kjøre på [http://localhost:4983](http://localhost:4983).

## Relaterte prosjekter

- [nano](https://github.com/echo-webkom/nano) - Nano-services for siden.
- [cenv](https://github.com/echo-webkom/cenv) - Environment fil skjekker
- [verv](https://github.com/echo-webkom/verv.echo.uib.no) - Nettsiden for verving av nye studenter i undergrupper
- [screen](https://github.com/echo-webkom/echo-screen) - Nettsiden for skjermen på lesesalen

<br>

<div align="center">
  <img width="20%" src="./.github/wetestinprod.png" />
  <img width="20%" src="./.github/anti-ai.png" />
</div>
