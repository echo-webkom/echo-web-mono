---
title: Ordbok
description: Liste med ord og uttrykk som vi bruker.
---

Liste med ord og uttrykk som brukes og bør forstås av alle Webkomere

- **Repo:** Refererer til et Git/GitHub _repository_. Det er en samling av kode, som oftest et prosjekt.
- **Monorepo:** Vårt GitHub-repo heter echo-web-_mono_ fordi det er et monolittisk repo. Dette betyr at det inneholder flere ulike apper i ett og samme repo (web, CMS, API, docs osv.). Monorepoer er en praktisk måte å utvikle flere applikasjoner på fordi det sikrer at alle har samme versjon av alle apper til enhver tid. Det gjør også kjøring av flere apper samtidig enklere, blant annet.
- **Stack (Teknologisk stack):** En liste med ulike verktøy og teknologier som brukes.
- **CMS:** Står for _Content Management System_. Vi bruker en løsning som heter [Sanity](https://www.sanity.io/). Den lar ikke-Webkom-medlemmer enkelt legge til data på nettsiden (arrangementer og poster) gjennom et brukervennlig grensesnitt med tekstbokser osv.
- **Deploy/Hosting:** Å _deploye_ en app betyr å laste den opp til en ekstern maskin og kjøre den der. Tjenesten eller bedriften som eier disse maskinene kalles en _hosting_-plattform. Vi bruker [Vercel](https://vercel.com/) for å hoste nettsiden.
- **REST og API:** API (_Application Programming Interface_) betyr i vår kontekst en HTTP-server med eksponerte endepunkter som henter eller skriver data (for eksempel henter alle arrangementer). REST (_Representational State Transfer_) er en API-standard for hvordan endepunkter og data skal se ut. Den legger vekt på at API-kall skal være “stateless”, altså at ingen tidligere kall skal påvirke eller være relatert til nye kall til API-et.
- **Docker:** Docker er et _containerization/sandboxing_-verktøy. Enkelt forklart er det et verktøy som lager og kjører små, isolerte miljøer (“mini-PC-er”) som inneholder programmet ditt, slik at det kan kjøre hvor som helst — også uten tilgang til omverdenen.
- **CI/CD:** Står for Continuous Integration/Deployment. Er automatiserte prosesser som bygger, tester, og deployer koden når du pusher endringer til repoet.
- **Rebase:** En måte å merge to Git grener på. Om Bob lager en ny branch `bob/foo` og legger til to commits `Update README` og `Add Foo` vil hans branch være to commits foran main. Om Alice pusher et commit til main vil Bob sin branch være ett commit back _og_ to commits foran main. For å fikse dette kan Bob _rebase_ (`git pull -r origin main`) for å hente Alice sine endringer, og så legge sine to commits på toppen av commit historikken igjen. Da kan han pushe til main uten problemer siden hans endringer er de nyeste og er ikke i konflikt med main.
