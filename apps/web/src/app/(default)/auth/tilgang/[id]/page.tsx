import { notFound } from "next/navigation";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { signInAttempt } from "@/data/kv/namespaces";
import { RequestAccessForm } from "./_components/request-access-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Access(props: Props) {
  const params = await props.params;

  const { id } = params;

  const attempt = await signInAttempt.get(id);

  if (!attempt) {
    return notFound();
  }

  const { error, email } = attempt;

  return (
    <div className="mx-4 my-14">
      <div className="bg-muted mx-auto flex w-full max-w-(--breakpoint-sm) flex-col gap-4 rounded-2xl p-8">
        <Heading level={2}>Noe gikk galt</Heading>

        <Text>
          Du får ikke lov til å logge inn grunnet: <b>{error}</b>
        </Text>

        <Text>Om du mener at dette er en feil, fyll ut skjemaet under for å be om tilgang.</Text>

        <RequestAccessForm email={email} />
      </div>
    </div>
  );
}
