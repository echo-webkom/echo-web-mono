import { useState } from "react";
import { z } from "zod";

import { bat } from "@/lib/bat";

const responseSchema = z.object({
  title: z.string(),
});

type Data = {
  reason: string;
};

type RegisterOpts = {
  onSuccess?: (data: z.infer<typeof responseSchema>) => void;
  onError?: (error: string) => void;
};

export function useDeregistration(slug: string, { onSuccess, onError }: RegisterOpts) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSucess, setIsSucess] = useState<boolean>(false);

  async function deregister(input: Data) {
    setIsLoading(true);

    try {
      const response = await bat.post(`/happening/${slug}/unregister`, input);

      if (response.ok) {
        setIsSucess(true);
        onSuccess?.({
          title: "Du er nå avmeldt",
        });
      } else {
        setError("Fikk ikke til å melde deg av");
        onError?.("Fikk ikke til å melde deg av");
      }
    } catch (err) {
      setError("Noe gikk galt");
      onError?.("Noe gikk galt");
    } finally {
      setIsLoading(false);
    }
  }

  return { isSucess, isLoading, error, deregister };
}
