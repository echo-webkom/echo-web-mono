"use client";

import { signIn } from "next-auth/react";

import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";

const providers = [
  {
    id: "feide",
    name: "Feide",
  },
];

export function SignInButtons() {
  return (
    <div>
      <Heading className="text-center">Velg en måte å logge inn på</Heading>

      <div className="my-10 flex flex-col justify-center gap-3">
        {providers.map(({ id, name }) => (
          <div className="mx-auto" key={id}>
            <Button
              onClick={() =>
                void signIn(id, {
                  callbackUrl: "/",
                })
              }
            >
              Logg inn med {name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
