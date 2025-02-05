import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";

const content = `
# Personvernerklæring

echo - Linjeforeningen for informatikk er behandlingsansvarlig for behandlingen av personopplysninger som beskrevet i denne personvernerklæringen. I denne personvernerklæringen forklarer vi hva slags personopplysninger vi lagrer og hvordan vi behandler de. Denne personvernerklæringen gjelder for: [echo.uib.no](https://echo.uib.no)

For vår erklæring om bruk av informasjonskapsler, trykk [her](/informasjonskapsler)

## Hvilke opplysninger behandler vi?

Vi behandler følgende kategorier av personopplysininger:

- **Grunnleggende informasjon:** Navn og fødselsdato
- **Kontaktinformasjon:** E-postadresse
- **Konto og profilinformasjon:** Innstillinger og preferanser
- **Helsopplysninger:** Allergier og annen relevant helseinfo

Personopplysningene samles inn via FEIDE innlogging og direkte fra deg gjennom informasjon du oppgir til oss.

## Hvordan behandler vi opplysningene?
Når du benytter deg av nettsiden, samler vi inn informasjon om blant annet:
- **Brukerinformasjon:** Dette er informasjon som autentiserer deg som bruker, og som lagrer hvilke rettigheter du har til å se og redigere innhold.
- **Påmeldingsinformasjon:** Opplysninger om hvilke arrangementer du har meldt deg på, spørsmål besvart ved påmelding, når du meldte deg på og eventuell avmelding.

### Sensitive opplysninger
Når du melder deg på arrangement i regi av echo, vil vi av og til spørre om helserelatert info som allergier. Dette er for å ivareta dine interesser.

## Behandlingsgrunnlag
- **Samtykke:** Du har gitt oss samtykke til å behandle opplysningene dine.
- **Oppfylle avtale med deg:** Vi samler inn informasjon 
- **Beskytte vitale interesser:** Vi samler inn opplysninger om blant annet hvilke allergier du har for å kunne tilpasse våre arrangement slik at vi kan ivareta dine vitale interesser.

## Dine rettigheter
Dersom du ønsker å utøve dine rettigheter, ta kontakt med oss på [echo@uib.no](mailto:echo@uib.no).

### Rett til innsyn i egne opplysninger
Du kan be om en kopi av alle opplysninger vi behandler om deg. Ta kontakt på epostadressen ovenfor for å bruke innsynsretten din.

### Rett til korrigering av personopplysninger
Du har rett til å be oss rette eller supplere opplysninger som er feilaktige eller misvisende.

### Retten til sletting av personopplysninger
Du har rett til å få dine personopplysninger slettet uten ugrunnet opphold. Du kan derfor når som helst be oss slette opplysninger om deg selv. Men merk at informasjon som vi er pålagt beholde av hensyn til andre rettslige forpliktelser (som for eksempel bokføringsloven) ikke vil bli slettet.

### Begrensning av behandling av personopplysninger
I noen situasjoner kan du også be oss begrense behandlingen av opplysninger om deg. Dette gjør du ved å administrere samtykker eller reservasjoner i våre løsninger.

### Protestere mot en behandling av personopplysninger
Dersom vi behandler opplysninger om deg med grunnlag i våre oppgaver eller på bakgrunn av en interesseavveining, har du rett til å protestere på vår behandling av opplysninger om deg. Dette gjør du ved å administrere samtykker eller reservasjoner i våre løsninger.

### Dataportabilitet
Du har rett til å få utlevert dine personopplysninger i et strukturert, alminnelig anvendt og maskinlesbart format. Ta kontakt på epostadressen ovenfor for å få utlevert dine personopplysninger.

### Du kan klage på vår behandling av personopplysninger
Vi håper du vil si ifra dersom du mener vi ikke overholder reglene i personopplysningsloven. Si da gjerne først i fra gjennom den kontakten eller kanalen du allerede har etablert med oss. Du kan også klage over vår behandling av personopplysninger. Dette gjør du til Datatilsynet.
`;

export default function GDPR() {
  return (
    <Container className="py-10">
      <Markdown content={content}></Markdown>
    </Container>
  );
}
