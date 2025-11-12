"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/use-is-mounted";

export default function Cookies() {
  const isMounted = useIsMounted();
  const [consent, setConsent] = useState(() => {
    if (typeof window === "undefined") return "Denied";
    return localStorage.getItem("cookies") === "Accepted" ? "Accepted" : "Denied";
  });

  const clicked = () => {
    localStorage.setItem("cookies", "Accepted");
    setConsent("Accepted");
  };

  if (!isMounted) {
    return null;
  }

  if (consent !== "Accepted") {
    return (
      <div>
        <div className="fixed bottom-10 z-50 flex w-full justify-self-center rounded-2xl border-2 border-black bg-white p-5 text-black sm:max-w-1/2">
          <div className="space-y-5">
            <h1 className="text-2xl font-bold">Vi bruker cookies!</h1>
            <p>
              For å sikre kvaliteten på tjenestene våre, og for å minne alle på at echo alltid
              skrives med liten e, bruker vi cookies 🍪.
              <Link className="underline" href="/informasjonskapsler">
                {" "}
                Les mer ➡️
              </Link>
            </p>
            <Button
              size="lg"
              onClick={clicked}
              variant="outline"
              className="bg-amber-100 text-black"
            >
              Forstått
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
