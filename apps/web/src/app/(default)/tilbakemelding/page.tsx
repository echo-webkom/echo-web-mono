import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { FeedbackForm } from "./feedback-form";

export default function FeedbackPage() {
  return (
    <Container className="py-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-2">
          <Heading className="font-medium">Send inn tilbakemelding</Heading>
          <Text>
            Din tilbakemelding betyr mye for oss. Gjerne fortell oss hva du ønsker å se på nettsiden
            eller hva vi kan gjøre bedre. Alternativt kan du også opprette en issue på GitHub for å
            rapportere en feil.
          </Text>
        </div>

        <FeedbackForm />
      </div>
    </Container>
  );
}
