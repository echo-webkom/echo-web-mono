"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { verifyEmail } from "@/actions/verify-email";
import { Button } from "@/components/ui/button";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    email?: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!token) {
      setResult({
        success: false,
        message: "Ingen token funnet i URL-en",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await verifyEmail(token);
      setResult(response);
    } catch {
      setResult({
        success: false,
        message: "En feil oppstod under bekreftelse",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600">
          Ugyldig lenke. Kontroller at du bruker den riktige lenken fra e-posten.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="text-center">
        {result.success ? (
          <div>
            <div className="mb-4 text-6xl">✅</div>
            <h2 className="mb-2 text-xl font-semibold text-green-600">E-post bekreftet!</h2>
            <p className="text-gray-600">{result.message}</p>
            {result.email && (
              <p className="mt-2 text-sm text-gray-500">E-postadresse: {result.email}</p>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 text-6xl">❌</div>
            <h2 className="mb-2 text-xl font-semibold text-red-600">Bekreftelse feilet</h2>
            <p className="text-gray-600">{result.message}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="mb-6 text-gray-600">
        Klikk på knappen under for å bekrefte e-postadressen din.
      </p>

      <Button onClick={handleVerify} disabled={isVerifying}>
        {isVerifying ? "Bekrefter..." : "Bekreft e-postadresse"}
      </Button>
    </div>
  );
}
