"use client";

import Image from "next/image";
import Link from "next/link";

import EchoLogo from "@/assets/images/echo-logo.png";
import { Feide } from "@/components/icons/feide";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";

export const SignInButtons = () => {
  return (
    <div className="border-muted-dark bg-muted mx-auto flex w-full max-w-[380px] flex-col rounded-xl border-2 p-8">
      <Image src={EchoLogo} alt="echo logo" width={100} height={100} className="mx-auto" />

      <Heading level={3} className="mx-auto mb-8">
        Velg en måte å logge inn
      </Heading>

      <ul className="mb-4 flex flex-col justify-center gap-3">
        <li>
          <Button
            className="group border-feide-dark bg-feide hover:border-feide hover:bg-feide-hover w-full gap-2 hover:text-black"
            asChild
          >
            <Link href="/api/auth/feide">
              <Feide className="h-5 w-5" />
              Logg inn med Feide
            </Link>
          </Button>
        </li>
      </ul>

      <Text size="sm" className="text-muted-foreground">
        For å kunne logge inn må du være medlem av echo.{" "}
        <Link className="underline" href="/om/vedtekter#§-2-medlemmer">
          Les mer her.
        </Link>
      </Text>
    </div>
  );
};
