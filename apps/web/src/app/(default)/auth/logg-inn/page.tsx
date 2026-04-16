import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { Callout } from "@/components/typography/callout";
import { Text } from "@/components/typography/text";

import { SignInButtons } from "./_components/sign-in-buttons";

type Props = {
  searchParams: Promise<{
    attemptId?: string;
    error?: string;
  }>;
};

const getErrorMessage = (error?: string) => {
  if (!error) return null;

  switch (error) {
    case "not_allowed":
      return "Du har ikke tilgang til å logge inn. Du må være student ved UiB.";
    case "user_not_found":
      return "Bruker ikke funnet. Du må være medlem av echo for å logge inn.";
    case "expired_token":
      return "Innloggingslenken har utløpt. Vennligst send en ny magic link.";
    case "invalid_token":
      return "Ugyldig innloggingslenke. Lenken kan være utløpt eller allerede brukt.";
    case "unverified-alternative-email":
      return "Du må bekrefte din alternative e-post før du kan logge inn med den. Sjekk din innboks for verifiseringsepost.";
    default:
      return "Innlogging feilet. Vennligst prøv igjen.";
  }
};

export default async function SignInPage(props: Props) {
  const user = await auth();

  if (user) {
    redirect("/");
  }

  const { attemptId, error } = await props.searchParams;
  const attempt = attemptId ? await unoWithAdmin.auth.getSignInAttempt(attemptId) : null;

  const errorMessage = getErrorMessage(error);

  return (
    <div className="mx-4 my-14 flex flex-col gap-4">
      {errorMessage && !attempt && (
        <Callout className="mx-auto max-w-95" type="warning">
          <Text size="sm">{errorMessage}</Text>
        </Callout>
      )}

      {Boolean(attempt) && (
        <Callout className="mx-auto max-w-95" type="warning">
          <Text size="sm">
            Noe gikk galt. Dette kan være grunnet til at vi ikke automatisk får til å finne ut om du
            er medlem.{" "}
            <span className="font-bold">
              Om du mener dette er feil vennligst{" "}
              <Link
                href={`/auth/tilgang/${attemptId}`}
                className="flex gap-2 underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                be om tilgang her. <ExternalLink className="inline size-4" />
              </Link>
            </span>
          </Text>
          <Text size="sm">
            Du kan også sjekke om du har tilgang ved å logge inn på{" "}
            <Link
              className="underline hover:no-underline"
              href="https://innsyn.feide.no"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feide Innsyn <ExternalLink className="inline size-4" />
            </Link>
            , og se om du har gruppetilhørighet til studieprogammene på informatikk.
          </Text>
        </Callout>
      )}

      <SignInButtons />
    </div>
  );
}
