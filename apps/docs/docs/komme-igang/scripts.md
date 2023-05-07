# Scripts

Vi har noen scripts som gjør det enklere å kjøre kommandoer.

## `pnpm`

Vi bruker [`pnpm`](https://pnpm.io/) som package manager. Denne er mye raskere enn `npm` og `yarn`, og har en del andre fordeler. Du kan lese mer om det på [nettsiden deres](https://pnpm.io/).

## `pnpm dev:{web|docs|cms|studio|all}`

Dette scriptet starter opp utviklingsmiljøet for web, dokumentasjon, cms, prisma eller alle sammen. Om man ønsker å starte nettsiden bruker man `pnpm dev:web`.

```sh
pnpm dev:web
pnpm dev:docs
pnpm dev:cms
pnpm dev:studio
pnpm dev:all
```

## `pnpm docker:{up|down}`

Denne kommandoen starter eller stopper databasen. Databasen er en postgres database som kjører i en docker container.

```sh
pnpm docker:up
pnpm docker:down
```

:::note HUSK
Husk å initialisere databasen etter at du har startet den. Dette gjøres med `pnpm db:deploy`.
:::

## `pnpm db:generate`

Dette scriptet genererer prisma typer. Disse brukes for å gjøre det enklere å bruke prisma i typescript.

```sh
pnpm db:generate
```

## `pnpm db:deploy`

Dette scriptet initialiserer databasen. Det er viktig å kjøre dette scriptet etter at databasen er startet.

```sh
pnpm db:deploy
```

## `pnpm db:migrate`

Dette scriptet lager ny migrasjon. Her må du også kjøre databasen først.

```sh
pnpm db:migrate
```

## `pnpm lint`

Denne kommandoen kjører linting på hele prosjektet. Den vil ikke fikse problemene. Linting kan hjelpe deg med å skrive bedre kode, og er en viktig del av prosjektet.

```sh
pnpm lint
```

## `pnpm lint-fix`

Scriptet fikser linting problemer. Om `pnpm lint` finner problemer, kan du kjøre dette scriptet for å fikse dem.

```sh
pnpm lint-fix
```

## `pnpm format`

Denne kommandoen formatterer koden etter reglene vi har satt i `prettier.config.cjs`.

```sh
pnpm format
```

## `pnpm format-check`

Denne kommandoen sjekker om koden er formattert etter reglene vi har satt i `prettier.config.cjs`, og vil ikke fikse de automatisk.

```sh
pnpm format-check
```

## `pnpm type-check`

Kjører typescript sin kompilator uten å faktisk kompilere koden. Denne vil sjekke om alle typene i koden er skrevet riktig, og om det er noen feil i koden.

```sh
pnpm type-check
```

<!---
TODO: Add more
-->
