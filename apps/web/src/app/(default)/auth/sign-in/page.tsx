import {getProviders} from "next-auth/react";

import Container from "@/components/container";
import SignInButtons from "@/components/sign-in-buttons";
import Heading from "@/components/ui/heading";

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <Container>
      {providers ? (
        <SignInButtons providers={providers} />
      ) : (
        <div className="flex flex-col justify-center gap-3">
          <Heading>Ingen tilgjengelige innloggingstjenester</Heading>
        </div>
      )}
    </Container>
  );
}
