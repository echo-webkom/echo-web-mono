import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { getAllFeedback } from "@/data/site-feedbacks/queries";
import { ensureWebkom } from "@/lib/ensure";
import { Feedback } from "./_components/feedback";

export default async function FeedbackOverview() {
  await ensureWebkom();
  const feedback = await getAllFeedback();

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
