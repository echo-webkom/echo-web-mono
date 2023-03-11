# echo Web

<div aling="center" style="display: flex;gap: 10px; margin: 10px auto;">
  <a href="https://sanity.io" target="_blank" rel="noopener">
    <img src="https://cdn.sanity.io/images/3do82whm/next/51af00784c5addcf63ae7f0c416756acca7e63ac-353x71.svg?dl=sanity-logo.svg" width="180" alt="Powered by Sanity" />
  </a>

  <a href="https://vercel.com/?utm_source=echo-webkom&utm_campaign=oss" target="_blank" rel="noopener">
    <img src=".github/powered-by-vercel.svg" width="175" alt="Powered by Vercel" />
  </a>
</div>

Full-stack monorepo for nettsiden til **echo – Linjeforeningen for informatikk** ved Universitetet i Bergen.

Utviklet av frivillige informatikkstudenter fra undergruppen **echo Webkom**.

## Tilbakemeldinger

Har du noen tilbakemeldinger til nettsiden?
Vi jobber hele tiden med å forbedre den,
og setter stor pris på om du sier ifra om noe er feil,
eller du har idéer til nye endringer!

Send oss gjerne en tilbakemelding via skjemaet nederst i høyre hjørne på https://echo.uib.no,
eller send oss en mail på [webkom-styret@echo.uib.no](mailto:webkom-styret@echo.uib.no).

## Hvordan kjøre?

Først forventer vi at du har installert alle "dependencies" og lagt til `.env` slik det er vist under.

1. Last ned "dependencies"

   ```sh
   pnpm install
   ```

2. Kopier `.env.example` til `.env`

   ```sh
   cp .env.example .env
   ```

### Nettsiden og CMS

> **Note**
> Sanity er enda ikke lagt til

```sh
pnpm dev
```

Nettsiden skal kjøre på [localhost:3000](http://localhost:3000/)

> **Note**
> Sanity er enda ikke lagt til

Sanity skal kjøre på [localhost:4000](http://localhost:4000/)

### Prisma Studio

```sh
pnpm db:studio
```

Prisma Studio skal kjøre på [localhost:4444](http://localhost:4444/)

## Lese mer

[Du kan lese mer på vår wiki!](https://github.com/echo-webkom/new-echo-web-monorepo/wiki)
