import Link from "next/link";

import { Callout } from "@/components/typography/callout";
import { Text } from "@/components/typography/text";
import { signInAttempt } from "@/data/kv/namespaces";
import { SignInButtons } from "./_components/sign-in-buttons";

type Props = {
  searchParams: Promise<{
    attemptId?: string;
  }>;
};

export default async function SignInPage(props: Props) {
  const searchParams = await props.searchParams;
  const { attemptId } = searchParams;

  const isValidAttemptId = attemptId && (await signInAttempt.get(attemptId));

  return (
    <div className="mx-4 my-14 flex flex-col gap-4">
      {Boolean(isValidAttemptId) && (
        <Callout className="mx-auto max-w-screen-sm" type="warning">
          <Text size="sm">
            Noe gikk galt. Dette kan være grunnet til at vi ikke automatisk får til å finne ut om du
            er medlem. Om du mener dette er feil vennligst{" "}
            <Link href={`/auth/tilgang/${attemptId}`} className="underline hover:no-underline">
              be om tilgang her.
            </Link>
          </Text>
          <Text size="sm">
            Du kan også sjekke om du har tilgang ved å logge inn på{" "}
            <Link className="underline hover:no-underline" href="https://innsyn.feide.no">
              Feide Innsyn
            </Link>
            , og se om du har gruppetilhørighet til studieprogammene på informatikk.
          </Text>
        </Callout>
      )}

      <SignInButtons />
    </div>
  );
}
