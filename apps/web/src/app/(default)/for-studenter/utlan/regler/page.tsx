import { RxQuestionMarkCircled } from "react-icons/rx";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export const metadata = {
  title: "Regler for utlån",
};

export default function UtlanReglerPage() {
  return (
    <Container className="py-10">
      <Heading>Regler for utlån</Heading>
      <p className="text-muted-foreground">Her finner du informasjon om reglene for utlån.</p>
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>Utlån er kun for medlemmer av echo.</li>
        <li>Utlånte gjenstander skal returneres i samme stand som de ble lånt ut.</li>
        <li>
          Ved skade eller tap av utlånte gjenstander, må dette rapporteres umiddelbart og
          gjenstanden må erstattes.
        </li>
        <li>echo forbeholder seg retten til å nekte utlån ved misbruk av reglene.</li>
        <li>
          Utlån av utstyr er en gode for medlemmene som vil bli fjernet dersom reglene ikke følges.
        </li>
      </ul>
      <br />
      <p className="flex flex-row items-center">
        <RxQuestionMarkCircled className="mr-2 inline-block" size={20} />
        Ved spørsmål om reglene for utlån, vennligst ta kontakt med oss på e-post.{" "}
        <a href="mailto:echo@uib.no">echo@uib.no</a>
      </p>
    </Container>
  );
}
