---
sidebar_position: 2
---

# Verktøy

## Git

Git er et distribuert versjonskontrollsystem som brukes til å administrere kodebasen til et prosjekt. Med Git kan flere utviklere samarbeide om samme kodebase og holde styr på endringer som er gjort over tid. Det er enkelt å lage nye grener, merge endringer og rulle tilbake til tidligere versjoner av koden hvis det oppstår problemer.

## VSCode

Visual Studio Code er en kraftig og svært tilpasningsdyktig tekstredigerer som brukes til å utvikle programvare. Det har innebygd støtte for mange forskjellige programmeringsspråk og kan utvides med en rekke utvidelser som gir ekstra funksjonalitet. VSCode har også innebygd støtte for feilsøking og debugging, integrasjon med Git og en rekke andre utviklerverktøy.

## Docker

Docker er en plattform for å utvikle, distribuere og kjøre applikasjoner i containere. Med Docker kan utviklere pakke en applikasjon og dens avhengigheter i en enkelt beholder, som kan kjøres på en hvilken som helst maskin som har Docker installert. Dette gjør det enkelt å sette opp utviklingsmiljøer og distribuere applikasjoner på en konsistent måte, uavhengig av maskinvare- eller programvarekonfigurasjoner.

Vi bruker Docker for å kjøre databasen våres lokalt. Dette gjør det enkelt å sette opp et utviklingsmiljø.

## PNPM

PNPM er en pakkebehandler for Node.js-prosjekter som er utviklet for å forbedre ytelsen og redusere diskplassen som kreves for avhengigheter. I motsetning til andre pakkebehandlere som NPM eller Yarn, lagrer PNPM ikke kopier av avhengigheter i hver enkelt prosjektmapp. I stedet bruker det en delt cache, noe som betyr at flere prosjekter kan dele de samme avhengighetene uten å duplisere data. Dette reduserer diskplassen som kreves og kan føre til raskere installasjoner og bygging av prosjekter.
