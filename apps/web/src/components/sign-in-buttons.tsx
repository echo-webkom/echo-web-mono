"use client";

import {signIn, type getProviders} from "next-auth/react";

import {Button} from "./ui/button";
import Heading from "./ui/heading";

export default function SignInButtons({
  providers,
}: {
  providers: Exclude<Awaited<ReturnType<typeof getProviders>>, null>;
}) {
  return (
    <div>
      <Heading>Velg en måte å logge inn på</Heading>
      <div className="flex flex-col justify-center gap-3">
        {Object.values(providers).map((provider) => (
          <div className="mx-auto" key={provider.name}>
            <Button
              onClick={() =>
                void signIn(provider.id, {
                  callbackUrl: "/",
                })
              }
            >
              Logg inn med {provider.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
