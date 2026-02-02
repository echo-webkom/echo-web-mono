"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import EchoLogo from "@/assets/images/echo-logo.png";
import { Feide } from "@/components/icons/feide";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMagicLink } from "../_actions/magic-link";

export const SignInButtons = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await sendMagicLink(email);

      if (result.success) {
        setMessage({ text: result.message, isError: false });
        setEmail("");
      } else {
        setMessage({ text: result.error, isError: true });
      }
    } catch {
      setMessage({ text: "En feil oppstod. Prøv igjen senere.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-muted-dark bg-muted mx-auto flex w-full max-w-95 flex-col rounded-xl border-2 p-8">
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

      <div className="mb-4">
        <Text size="sm" className="mb-2 font-semibold">
          Eller logg inn med e-post
        </Text>
        <form onSubmit={handleMagicLinkSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="din-epost@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={!email || isLoading} className="w-full">
            {isLoading ? "Sender..." : "Send magic link"}
          </Button>
          {message && (
            <Text size="sm" className={message.isError ? "text-red-600" : "text-green-600"}>
              {message.text}
            </Text>
          )}
        </form>
        <Text size="sm" className="text-muted-foreground mt-2 text-xs">
          Du kan bruke hoved-e-posten din fra Feide, eller din alternativ e-post om den er
          bekreftet.
        </Text>
      </div>

      <Text size="sm" className="text-muted-foreground">
        For å kunne logge inn må du være medlem av echo.{" "}
        <Link className="underline" href="/om/vedtekter#§-2-medlemmer">
          Les mer her.
        </Link>
      </Text>
    </div>
  );
};
