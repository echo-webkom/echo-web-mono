import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";

const body = `Det er virkelig frustrerende og rett og slett uakseptabelt når folk ikke tar seg bryet med å skrive "echo" med liten 'e' når de refererer til echo - Linjeforeningen for informatikk. Dette er ikke bare en tilfeldig preferanse eller en triviell detalj – det er grunnleggende for hvordan foreningen presenterer seg selv og opprettholder sin identitet. Når noen skriver "Echo" med stor 'E', viser det en klar mangel på respekt og oppmerksomhet til detaljer som er helt essensiell i akademiske og profesjonelle miljøer.

Dette er ikke rocket science. Det er en enkel regel som er lett å følge, og allikevel klarer noen å rote det til, noe som er direkte irriterende. Hver gang noen feilaktig bruker stor 'E', bidrar det til potensiell forvirring og misforståelser om hvem vi er og hva vi står for. Det er ikke noe mindre enn sløvt og vitner om en bekymringsverdig mangel på omtanke.

Videre kan denne type slendrian med navnet føre til at foreningens omdømme blir svekket. Det kan høres overdrevet ut for noen, men i realiteten kan slike små feil akkumuleres og føre til et generelt inntrykk av uorden og mangel på profesjonalitet. Er det virkelig så vanskelig å ta et ekstra sekund for å sørge for at man skriver navnet vårt riktig?

For alle oss som er en del av echo, er dette ikke bare irriterende, det er direkte respektløst. Det viser en mangel på forståelse for vår kultur og våre verdier. Det minste man kan gjøre, hvis man skal omtale oss, er å få det grunnleggende riktig. Så neste gang du skriver om eller refererer til vår forening, husk at det er "echo" med liten 'e'. Det er ikke for mye å be om.`;

export default function SmallE() {
  return (
    <Container className="py-10">
      <Heading className="mb-4">
        echo, ikke {'"'}Echo{'"'}
      </Heading>
      <Markdown className="text-lg" content={body} />
    </Container>
  );
}
