"use client";

import {signIn, type getProviders} from "next-auth/react";

import {Button} from "./ui/button";

export default function SignInButtons({
  providers,
}: {
  providers: Exclude<Awaited<ReturnType<typeof getProviders>>, null>;
}) {
  return (
    <div>
      <h1 className="mb-10 text-center text-3xl font-bold">Velg en måte å logge inn på</h1>
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
