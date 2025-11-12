"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (consent !== "Accepted") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [consent]);

  if (!isMounted) {
    return null;
  }

  if (consent !== "Accepted") {
    return (
      <div>
        <div className="absolute inset-0 z-49 overscroll-none bg-black/50 backdrop-blur-sm" />

        <div className="fixed bottom-10 z-50 flex justify-self-center rounded-2xl border-2 border-black bg-white p-5 text-black sm:max-w-1/2">
          <div className="space-y-5">
            <h1 className="text-2xl font-bold">Vi bruker cookies!</h1>
            <p>
              For å sikre kvaliteten på tjenestene våre, og for å minne alle på at echo alltid
              skrives med liten e, bruker vi cookies 🍪.
              <Link href="/informasjonskapsler"> Les mer ➡️</Link>
            </p>
            <Button
              size="lg"
              onClick={clicked}
              variant="outline"
              className="bg-amber-100 text-black"
            >
              Godta
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
