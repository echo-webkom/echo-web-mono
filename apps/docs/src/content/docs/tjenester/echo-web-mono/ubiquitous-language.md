---
title: Ubiquitous Language
description: Felles domenespråk for echo-web-mono på tvers av web, API, CMS og database.
---

Denne siden definerer felles begreper vi bruker i `echo-web-mono` for å redusere misforståelser mellom utviklere og domeneeiere.

## Hvorfor

- Samme ord skal bety det samme i kode, docs og diskusjoner
- Redusere tvetydighet i PR-er, issues og incident-håndtering
- Gjøre navngivning i API, database og UI mer konsistent

## Kjernebegreper

- **Bruker (User)**: En person med konto i systemet.
- **Happening**: Domene navn for alle typer arrangementer vi håndterer. Kan være av ulike typer:
  - **Arrangement**: Norsk produktord for happenings av typen `event`.
  - **Bedriftspresentasjon (Bedpres)**: Happening av typen `bedpres`.
- **Påmelding (Registration)**: En brukers registrering til en happening.
- **Whitelist**: Manuell tillatelsesliste med utløpstid.
- **Access Request**: Forespørsel om å bli gitt tilgang/whitelist.
- **Dot / Prikk**: "Straff" for å f.eks ikke melde seg av en happening. En dot har utløpstid, og om man får for mange dots innen en periode kan det føre til en ban.
- **Ban info / Ban**: Informasjon om en brukers utestengelse. Om en bruker er koblet til en ban info er de bannet. En ban går ut etter en viss tid.
- **Site Feedback**: Tilbakemelding fra brukere om problemer, ønsker eller andre kommentarer relatert til nettstedet.
- **Group / Gruppe**: Hvilken gruppe en bruker tilhører. Dette er som oftes knyttet til undergruppen de er med i.
- **Spot range**: Regler for hvor mange plasser en happening har, og hvilke årstrinn som kan melde seg på. En happening kan ha flere spot ranges, for eksempel 20 plass for 1 - 3 og 10 plasser for 4 - 5.

## Produkter

- **echo-web**: Hele webapplikasjonen, inkludert API, CMS og frontend.
- **uno**: API-tjenesten som håndterer kjernefunksjonalitet som happenings, påmeldinger og brukere.
- **cms/sanity**: CMS (Content Management System) er det som blir brukt av ikke-tekniske brukere for å administrere innholdet på nettsiden, som happenings og bedriftspresentasjoner. Vi bruker Sanity som vårt CMS.

## Livssyklusbegreper

- **Publisert**: Synlig for sluttbrukere.
- **Upublisert**: Lagret, men ikke synlig.
- **Åpen påmelding**: Nye påmeldinger er tillatt.
- **Stengt påmelding**: Nye påmeldinger er blokkert.

## API- og datarelaterte begreper

- **DTO**: Transportformat inn/ut av HTTP-laget.
- **Domene-modell**: Modell brukt i kjernelogikk, uavhengig av lagring/transport.
- **Port**: Interface definert i domenet for avhengigheter ut av domenet. Sier hvilke funksjoner en adapter må implementere.
- **Adapter**: Implementasjon av en port (f.eks. Postgres, ekstern tjeneste).
- **Service**: Forretningsregel eller operasjon i domenelaget.

## Navngivningskonvensjoner

- API paths: substantiv i flertall der det passer (`/happenings`, `/registrations`)
- Typer/modeller: entall (`Happening`, `Registration`, `User`)
- IDs: `<entitet>Id` (for eksempel `happeningId`, `userId`)
- Tidsfelt: bruk eksplisitte navn (`startsAt`, `endsAt`, `publishedAt`). Avslutt også med `At` for å indikere at det er et tidsstempel.
- Boolean-felter: prefiks med `is` eller `has` (`isPublished`, `hasOpenRegistration`)
