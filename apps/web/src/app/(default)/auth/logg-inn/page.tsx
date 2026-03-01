import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth/session";
import { Callout } from "@/components/typography/callout";
import { Text } from "@/components/typography/text";
import { signInAttempt } from "@/data/kv/namespaces";
import { SignInButtons } from "./_components/sign-in-buttons";

type Props = {
  searchParams: Promise<{
    attemptId?: string;
    error?: string;
  }>;
};

export default async function SignInPage(props: Props) {
  const user = await auth();

  if (user) {
    redirect("/");
  }

  const { attemptId, error } = await props.searchParams;

  const attempt = attemptId && (await signInAttempt.get(attemptId));

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case "invalid-token":
        return "Ugyldig innloggingslenke. Lenken kan være utløpt eller allerede brukt.";
      case "expired-token":
        return "Innloggingslenken har utløpt. Vennligst send en ny magic link.";
      case "user-not-found":
        return "Bruker ikke funnet. Du må være medlem av echo for å logge inn.";
      case "unverified-alternative-email":
        return "Du må bekrefte din alternative e-post før du kan logge inn med den. Sjekk din innboks for verifiseringsepost.";
      case "verification-failed":
        return "Innlogging feilet. Vennligst prøv igjen.";
      case "token_exchange_failed":
        return "Kunne ikke fullføre innlogging med Feide. Vennligst prøv igjen.";
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="mx-4 my-14 flex flex-col gap-4">
      {errorMessage && (
        <Callout className="mx-auto max-w-2xl" type="warning">
          <Text size="sm">{errorMessage}</Text>
        </Callout>
      )}

      {Boolean(attempt) && (
        <Callout className="mx-auto max-w-2xl" type="warning">
          <Text size="sm">
            Noe gikk galt. Dette kan være grunnet til at vi ikke automatisk får til å finne ut om du
            er medlem.{" "}
            <span className="font-bold">
              Om du mener dette er feil vennligst{" "}
              <Link href={`/auth/tilgang/${attemptId}`} className="underline hover:no-underline">
                be om tilgang her.
              </Link>
            </span>
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
