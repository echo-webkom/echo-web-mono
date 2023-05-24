# Din første endring til koden

For å gjøre en endring til koden må du først gjøre en kopi av koden til din egen maskin. Dette gjør du ved å bruke kommandoen `git clone`. Denne kommandoen tar en URL som argument, og lager en kopi av koden på din maskin.

```sh title="Terminal"
git clone git@github.com:echo-webkom/new-echo-web-monorepo
```

Så kan du gå inn i mappen som ble laget, og åpne den i din favoritt editor. Vi anbefaler å bruke [Visual Studio Code](https://code.visualstudio.com/).

```sh title="Terminal"
cd new-echo-web-monorepo
code .
```

:::note Merk
Hvis du ikke har VS Code installert, kan du åpne mappen i en annen editor.
:::

:::note Merk
`code .` er en kommando som åpner mappen i VSCode.
:::

## Installer dependencies

For å kunne kjøre koden må du installere dependencies. Dette gjør du ved å bruke kommandoen `pnpm install`.

```sh title="Terminal"
pnpm install
```

## Generere typer til Prisma

For å kunne bruke Prisma må du generere typer. Dette gjør du ved å bruke kommandoen `pnpm db:generate`. Dette skal skje automatisk etter har brukt `pnpm install`, men det kan være lurt å kjøre denne kommandoen på nytt hvis du får en feilmelding om at en type ikke eksisterer.

```sh title="Terminal"
pnpm db:generate
```

## Starte og opdatere databasen

For å kunne kjøre koden må du starte databasen. Dette gjør du ved å bruke kommandoen `pnpm docker:up`. Dette krever at du har Docker installert på maskinen din.

```sh title="Terminal"
pnpm docker:up
```

Etter du har startet databasen må du oppdatere tabellene med de fra Prisma. Det blir gjort med kommandoen `pnpm db:push`.

```sh title="Terminal"
pnpm db:deploy
```

## Starte koden

For å starte en utviklingsserver som automatisk oppdaterer når du gjør endringer, kan du bruke kommandoen `pnpm dev:web`.

```sh title="Terminal"
pnpm dev
```

Denne kommandoen vil starte nettsiden på [http://localhost:3000](http://localhost:3000), dokumentasjonen på [http://localhost:3001](http://localhost:3001), Sanity Studio på [http://localhost:3333](http://localhost:3333) og [Prisma Studio](https://www.prisma.io/studio) på [http://localhost:4000](http://localhost:4000).

## Lage en ny branch

Siden vi ikke tilater å pushe direkte til `main` branch må du lage en ny branch. Dette kan du gjøre ved å bruke kommandoen `git switch -c <branch-navn>`. Dette vil lage en ny branch med navnet du skriver inn, og bytte til denne branchen. Vi anbefaler å navngi branchen etter navnet ditt og hva du skal gjøre. For eksempel `git switch -c andreas/make-title-bigger`.

```sh title="Terminal"
git switch -c <branch-navn>
```

## Commit endringene dine

Når du har gjort endringene dine, må du commite dem. Dette gjør du ved å bruke kommandoen `git commit`. Denne kommandoen tar en melding som argument, som beskriver hva du har gjort. Denne meldingen skal være på engelsk og holdes kort. For eksempel `git commit -m "Make title bigger"`.

Før du kan commite endringene må du først "stage" dem. Dette gjør du ved å bruke kommandoen `git add`. Denne kommandoen tar en fil som argument, og legger den til i en liste over filer som skal commites. For å legge til alle filene du har endret kan du bruke kommandoen `git add .`.

```sh title="Terminal"
git add .
git commit -m "Make title bigger"
```

:::note Merk
Du kan bruke `git status` for å se hvilke filer som er endret, og hvilke filer som er staged.
:::

## Push endringene dine

Når du har commited endringene dine, må du pushe dem til GitHub. Dette gjør du ved å bruke kommandoen `git push`. Denne kommandoen tar inn to argumenter, navnet på remote og navnet på branchen du vil pushe til. For å pushe til `main` branchen på `origin` remote kan du bruke kommandoen `git push origin main`. I vårt tilfelle vil vi pushe til branchen `andreas/make-title-bigger` på `origin` remote, så vi kan bruke kommandoen `git push origin andreas/make-title-bigger`. Første gang du pusher til en branch må du bruke kommandoen `git push --set-upstream origin <branch-navn>`. Du kan også bruke kommandoen `git push -u origin <branch-navn>`, som er en forkortelse for kommandoen før.

:::note Merk
`origin` er i dette tilfellet GitHub repositoryet.
:::

```sh title="Terminal"
git push -u origin andreas/make-title-bigger
```

## Lage en PR

En PR er en forkortelse for "Pull Request". En PR er en forespørsel om å få endre på en fil eller flere filer i et repository. Vi bruker PRs for å gjøre det enklere å se hva som har blitt endret, og for å kunne diskutere endringer før de blir lagt til i koden. Det er også lettere å oppdage feil i koden ved å bruke PRs.

For å lage en PR etter du har pushet endringene dine kan du åpne nettleseren din og åpne GitHub repositoryet sin ["Pull Request" tab](https://github.com/echo-webkom/new-echo-web-monorepo/pulls). Her kan du trykke på "New pull request" knappen, og velge hvilken branch du vil lage en PR fra, og hvilken branch du vil lage en PR til.

Så må du lage en god tittel og beskrive hva du har gjort. Deretter kan du be om en review fra en eller flere personer.
