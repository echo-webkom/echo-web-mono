import { Container } from "@/components/container";
import { FeedbackForm } from "./feedback-form";

export default function FeedbackPage() {
  return (
    <Container className="py-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-4 md:sticky md:top-0">
          <h1 className="text-3xl font-medium">Send inn tilbakemelding</h1>
          <p className="text-lg">
            Din tilbakemelding betyr mye for oss. Gjerne fortell oss hva du ønsker å se på nettsiden
            eller hva vi kan gjøre bedre. Alternativt kan du også opprette en issue på GitHub for å
            rapportere en feil.
          </p>
        </div>

        <FeedbackForm />
      </div>
    </Container>
  );
}
