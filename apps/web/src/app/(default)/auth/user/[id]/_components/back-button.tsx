"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();        
      return;
    }

    router.push("/hjem");
  };

  return (
    <div className="flex gap-3 border-b p-5 md:hidden">
      <button type="button" onClick={handleClick} aria-label="Gå tilbake">
        <ArrowLeft className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-semibold">Tilbake</h1>
    </div>
  );
};