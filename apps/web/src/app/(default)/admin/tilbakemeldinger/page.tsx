import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureWebkom } from "@/lib/ensure";
import { unoWithAdmin } from "../../../../api/server";
import { Feedback } from "./_components/feedback";

export default async function FeedbackOverview() {
  await ensureWebkom();
  const feedback = await unoWithAdmin.siteFeedbacks.all();

  return (
    <Container>
      <Heading className="mb-4">Tilbakemeldinger</Heading>

      <ul className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {feedback.map((feedback) => (
          <li key={feedback.id}>
            <Feedback feedback={feedback} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
