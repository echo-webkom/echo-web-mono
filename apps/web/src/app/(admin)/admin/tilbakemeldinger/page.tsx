import { type SiteFeedback } from "@echo-webkom/db/schemas";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { getAllFeedback } from "@/lib/queries/feedback";

export const dynamic = "force-dynamic";

export default async function FeedbackOverview() {
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

function Feedback({ feedback }: { feedback: SiteFeedback }) {
  return (
    <div className="h-full w-full max-w-xl overflow-hidden rounded-lg bg-card px-4 py-5 text-card-foreground shadow sm:p-6 dark:border">
      <p className="text-xs text-muted-foreground">
        {feedback.createdAt.toLocaleTimeString("nb-NO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      <h3 className="font-medium">Navn: {feedback.name || "Ukjent"}</h3>
      <p className="text-sm font-medium text-muted-foreground">
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        E-post: {feedback.email || "Ukjent"}
      </p>

      <p className="text-sm font-medium text-muted-foreground">Tema: {feedback.category}</p>

      <hr className="my-3" />

      <div>
        <p className="break-words text-sm text-card-foreground">
          {/* Show line breaks */}
          {feedback.message.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
