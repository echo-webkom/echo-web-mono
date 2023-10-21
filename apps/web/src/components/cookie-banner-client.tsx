"use client";

import Link from "next/link";
import { Cross1Icon } from "@radix-ui/react-icons";

import { hideCookieBanner } from "@/actions/cookies";

export function CookieBannerClient() {
  const handleClose = async (quickClose: boolean) => {
    await hideCookieBanner(quickClose);
  };

  return (
    <div className="fixed bottom-0 left-0 m-4 max-w-md space-y-4 rounded-md border border-gray-200 bg-white p-4 shadow-lg">
      <h2 className="text-xl font-bold">🍪 Informasjonskapsler</h2>
      <p>
        Vi bruker informasjonskapsler, også kalt cookies, for å forbedre brukeropplevelsen din på
        nettsiden vår.
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => void handleClose(false)}
          className="rounded-md bg-black px-3 py-2 text-white transition-colors hover:bg-slate-800"
        >
          Jeg forstår
        </button>
        <Link
          className="rounded-md bg-transparent px-3 py-2 text-black transition-colors hover:bg-gray-100 hover:underline"
          href="/informasjonskapsler"
        >
          Les mer
        </Link>
      </div>
      <button onClick={() => void handleClose(true)} className="absolute right-0 top-0 m-4">
        <Cross1Icon />
      </button>
    </div>
  );
}
