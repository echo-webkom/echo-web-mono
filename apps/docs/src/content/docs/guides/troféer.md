---
title: Trofésystem
description: Hvordan trofésystemet fungerer og hvordan du legger til nye troféer.
---

Troféer vises på profilsiden til brukeren, og belønner for eksempel å møte opp på bedriftspresentasjoner. Foreløpig finnes det to troféer: **bedpres** og **gokart**.

Ingenting om hvilke troféer en bruker har lagres i databasen. Troféene regnes ut hver gang profilen lastes, ut fra to kilder:

- **Sanity** sier hvilke troféer som finnes, og hvilke nivåer de har.
- **Postgres** har statistikken til brukeren, for eksempel hvor mange bedpres-er hen har deltatt på.

#### Bedpres Trofé

En påmelding teller når **alle** disse er oppfylt:

- arrangementet har typen `bedpres`
- påmeldingen har status `registered`
- brukeren har fått registrert oppmøte (`attended = true`), **eller** påmeldingen ble opprettet før 23.09.2026

Datoen er med fordi oppmøte ikke ble registrert før den tid. Eldre påmeldinger regnes derfor som oppmøtt.

#### Gokart Trofé

Teller på samme måte som bedpres, men i stedet for typen må navnet på arrangementet inneholde «gokart», «go-kart» eller «go kart». Store og små bokstaver spiller ingen rolle.

## Legge til en ny type trofé

Et nytt trofé, for eksempel for antall kommentarer, krever to ting: trofeet må opprettes i Sanity, og tre filer i uno må oppdateres.

### 1. Opprett trofeet i Sanity

Opprett et nytt `trophy`-dokument i Sanity Studio og legg inn nivåene. Legg merke til tittelen du gir det, for den må stå helt likt i koden (se steg 2c).

### 2. Oppdater tre filer i uno

**a) `apps/uno/domain/model/user_stats.go`**

Legg til et nytt felt i `UserStats`:

```go
type UserStats struct {
	BedpresCount int
	GokartCount  int
	CommentCount int // nytt
}
```

**b) `apps/uno/infrastructure/postgres/user_stats.go`**

Her må du endre tre steder:

- Legg til en ny `COUNT(*) FILTER (...)`-kolonne i `userStatsQuery` som teller det trofeet skal belønne.
- Legg til feltet i den lokale `stats`-structen i `GetUserStats`, med `db`-taggen lik kolonnenavnet.
- Ta med feltet i `model.UserStats` som returneres.

Merk at `userStatsQuery` bare går gjennom påmeldinger med oppmøte. Skal trofeet telle noe annet, som kommentarer, må du skrive en egen spørring for det.

**c) `apps/uno/domain/service/trophy.go`**

Legg til en linje i `progress`-listen i `GetUserTrophies`. `title` må være nøyaktig den samme som tittelen på trofeet i Sanity:

```go
{title: "kommentar", count: userStats.CommentCount},
```

Nivået brukeren har nådd regnes ut automatisk.
