"use client";

import { CircleCheck, CircleAlert, LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { registerOwnAttendance, type AttendanceResult } from "../_actions/register-attendance";

type Props = {
  slug: string;
  title: string;
};

type Status = AttendanceResult["status"] | "loading";

const messages: Record<Status, { heading: string; description: string }> = {
  loading: {
    heading: "Registrerer oppmøte…",
    description: "Vent litt mens vi sjekker deg inn.",
  },
  attended: {
    heading: "Du er sjekket inn!",
    description: "Oppmøtet ditt er registrert. Kos deg på arrangementet!",
  },
  "already-attended": {
    heading: "Du er allerede sjekket inn",
    description: "Oppmøtet ditt er registrert. Du trenger ikke gjøre noe mer.",
  },
  unauthenticated: {
    heading: "Logg inn først",
    description:
      "Logg inn, og åpne denne lenken eller skann QR-koden på nytt for å registrere oppmøte.",
  },
  "not-registered": {
    heading: "Du er ikke påmeldt",
    description:
      "Du må ha en bekreftet plass på arrangementet for å registrere oppmøte. Ta kontakt med arrangøren hvis noe er feil.",
  },
  "not-found": {
    heading: "Fant ikke arrangementet",
    description: "Denne oppmøtelenken er ikke lenger gyldig. Ta kontakt med arrangøren.",
  },
  error: {
    heading: "Kunne ikke registrere oppmøte",
    description: "Noe gikk galt. Prøv igjen, eller ta kontakt med arrangøren.",
  },
};

export function RegisterAttendance({ slug, title }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const request = useRef<Promise<AttendanceResult> | null>(null);

  useEffect(() => {
    let active = true;
    // Reuse the request if React runs the effect twice in development.
    request.current ??= registerOwnAttendance(slug);
    void request.current
      .then((result) => {
        if (active) setStatus(result.status);
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const success = status === "attended" || status === "already-attended";
  const { heading, description } = messages[status];

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col items-center px-5 py-16 text-center sm:py-24">
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-[0.18em] uppercase">
        Oppmøte
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>

      <div
        role="status"
        aria-live="polite"
        aria-busy={status === "loading"}
        className="bg-card mt-8 flex w-full flex-col items-center rounded-2xl border px-6 py-8 shadow-sm"
      >
        <div
          className={`mb-5 rounded-full p-4 ${success ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}
        >
          {status === "loading" ? (
            <LoaderCircle
              className="size-8 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : success ? (
            <CircleCheck className="size-8" aria-hidden="true" />
          ) : status === "unauthenticated" ? (
            <LogIn className="size-8" aria-hidden="true" />
          ) : (
            <CircleAlert className="size-8" aria-hidden="true" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-balance">{heading}</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{description}</p>

        {status === "unauthenticated" && (
          <Button asChild className="mt-6">
            <Link href="/auth/logg-inn">Logg inn</Link>
          </Button>
        )}
        {status === "error" && (
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Prøv igjen
          </Button>
        )}
      </div>

      <Link
        href={`/arrangement/${slug}`}
        className="text-muted-foreground hover:text-foreground mt-6 text-sm underline underline-offset-4"
      >
        Til arrangementet
      </Link>
    </main>
  );
}
