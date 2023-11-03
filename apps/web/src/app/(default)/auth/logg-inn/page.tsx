import { isValidSignInError } from "@echo-webkom/auth/src/is-member-of-echo";

import { Container } from "@/components/container";
import { Callout } from "@/components/typography/callout";
import { SignInButtons } from "./sign-in-buttons";

type Props = {
  searchParams: {
    error?: string;
  };
};

export default function SignInPage({ searchParams }: Props) {
  const { error } = searchParams;

  return (
    <Container>
      {error && isValidSignInError(error) && (
        <Callout type="danger" className="mx-auto my-8 w-full max-w-lg">
          <p className="font-bold">Du har ikke lov til å logge inn...</p>
          <p>Grunn: {error}</p>
        </Callout>
      )}

      <SignInButtons />
    </Container>
  );
}
