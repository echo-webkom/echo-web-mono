import { type SiteFeedback } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";
import { getAllFeedback } from "@/lib/queries/feedback";

export const dynamic = "force-dynamic";

export default async function FeedbackOverview() {
  const feedback = await getAllFeedback();

  return (
    <Container>
      <Heading>Tilbakemeldinger</Heading>

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
    <div className="h-full w-full max-w-xl overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
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
      <h3 className="font-medium">Fra: {feedback.name || "Ingen"}</h3>
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      <p className="text-sm font-medium text-muted-foreground">{feedback.email || "Ingen"}</p>

      <hr className="my-3" />

      <div>
        <p className="break-words text-sm text-muted-foreground">
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
