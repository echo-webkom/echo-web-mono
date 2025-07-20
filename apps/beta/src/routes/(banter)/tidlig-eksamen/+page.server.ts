import type { PageServerLoad } from './$types';
import { marked } from 'marked';

export const prerender = true;

const body = `# Det heter "Tidlig eksamen", ikke "Konte eksamen"

Det er nesten komisk hvor få som faktisk vet hva «tidlig eksamen»
er, selv om den har eksistert i en årrekke ved fakultetet vårt. De fleste har
hørt om «kontinuasjonseksamen» – på folkemunne kalt «konte-eksamen» – men få
forstår at dette i realiteten er to ulike ordninger. Kontinuasjonseksamen er
lovfestet, og kommer i kjølvannet av [§ 5.6](https://lovdata.no/forskrift/2023-06-15-1359/§5-6),
som pålegger Universitetet å gi en ny sjanse til alle som hadde gyldig fravær
ved den ordinære eksamen. Det er altså ikke opp til fakultetet hvorvidt de skal
holde en slik konte eksamen eller ikke; de er NØDT- til det.

Det som derimot ikke står i noen forskrift, er at den ordinære eksamenen også
åpnes for alle andre, uansett grunn. «Tidlig eksamen» er rett og slett et
fakultetsinitiativ som gir enhver student, også dem som besto, muligheten til å
forbedre karakteren eller rett og slett gjennomføre emnet på nytt – uten å måtte
vente helt til neste ordinære eksamensperiode; Som man ofte må vente et helt år
på. Med andre ord: Fakultetet tar en ordning de er pålagt å holde for dem med
gyldig fravær, og utvider den til å gjelde absolutt alle. Det burde være
åpenbart at dette er et ekstra gode og slett ingen selvfølge.

Likevel er det overraskende mange som bare kaller alt «konte» og antar at dette
 er standard prosedyre som alle fakulteter tilbyr. Det er faktisk ikke riktig.
 Hadde det ikke vært for at våres fakultet ønsker å være fleksibelt og legge
 til rette for at flest mulig skal lykkes, ville «tidlig eksamen» ikke vært et
 tema i det hele tatt. Den har ingenting med lovkravet om kontinuasjon å gjøre,
 annet enn at de to ordningene av praktiske årsaker ofte avholdes samtidig.

Så neste gang du hører noen sier at de skal ta en «taktisk-kont», kan det være
verdt å minnes på at fakultetet faktisk gir denne ekstra muligheten til deg. Det
er strengt tatt mer enn det man kan kreve, og nettopp derfor er det på høy tid
at flere får øynene opp for hva tidlig eksamen faktisk innebærer.`;

export const load: PageServerLoad = async () => {
	return {
		body: await marked(body)
	};
};
