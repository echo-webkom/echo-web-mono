"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key.match(/^[a-zA-Z0-9 ]$/)) {
        void router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  return (
    <div className="font-block min-h-screen bg-[#000088] text-[#dddddd] selection:bg-gray-800/60">
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-20 text-xl md:text-3xl">
        <h1 className="text-4xl md:text-6xl">Finner ikke siden du ser etter...</h1>

        <div className="space-y-4">
          <p>Oops, ser ut som noen har rotet med koden her!</p>

          <p>
            Vi leter etter den savnede siden, men finner den ikke. Kanskje det er et tegn på at du
            bør komme deg ut og strekke på bena? Ta en kort spasertur og nyt noen frisk luft, mens
            vi prøver å fikse dette!
          </p>

          <p>Trykk hvilken som helst tast for å gå tilbake til forsiden.</p>
        </div>

        <div className="text-center">
          <Link href="/" className="p-4 hover:underline">
            Klikk her for å gå tilbake til forsiden
          </Link>
        </div>
      </main>
    </div>
  );
}
