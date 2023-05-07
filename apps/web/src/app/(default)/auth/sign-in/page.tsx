import {getProviders} from "next-auth/react";

import Container from "@/components/container";
import SignInButtons from "@/components/sign-in-buttons";

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <Container>
      {providers ? (
        <SignInButtons providers={providers} />
      ) : (
        <div className="flex flex-col justify-center gap-3">
          <h1 className="mb-10 text-center text-3xl font-bold">
            Ingen tilgjengelige innloggingstjenester
          </h1>
        </div>
      )}
    </Container>
  );
}
