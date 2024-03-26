# Seeder

Seeder er en CLI for å seede og synce databasen til `echo-web`.

## Kommandoer

### `all`

Seeder databasen og syncer den med Sanity datasettet.

`--mode <mode>` - Hva for noe data som databasen skal seedes med. Mulige verdier: `prod`, `dev` og `test`. Default: `dev`.

`--dataset <dataset>` - Hvilket dataset som skal synces med databasen. Default: `production`, `develop` eller `testing`.

### `sanity`

Syncer databasen med Sanity datasettet.

`--dataset <dataset>` - Hvilket dataset som skal synces med databasen. Default: `production`, `develop` eller `testing`.

### `database`

Seeder databasen.

`--mode <mode>` - Hva for noe data som databasen skal seedes med. Mulige verdier: `prod`, `dev` og `test`. Default: `dev`.

### `help`

Viser hjelp for kommandoene.
