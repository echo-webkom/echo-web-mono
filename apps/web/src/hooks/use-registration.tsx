import { useState } from "react";

import { bat } from "@/lib/bat";

type Data = {
  questions: Array<{
    question: string;
    answer?: string;
  }>;
};

type RegisterOpts = {
  onSuccess?: (data: string) => void;
  onError?: (error: string) => void;
};

export function useRegistration(slug: string, { onSuccess, onError }: RegisterOpts) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSucess, setIsSucess] = useState<boolean>(false);

  async function register(input: Data) {
    setIsLoading(true);

    try {
      const response = await bat.post(`/happening/${slug}/register`, input);

      const data = await response.text();

      if (response.ok) {
        setIsSucess(true);
        onSuccess?.(data);
      } else {
        setError(data);
        onError?.(data);
      }
    } catch (err) {
      setError("Noe gikk galt");
      onError?.("Noe gikk galt");
    } finally {
      setIsLoading(false);
    }
  }

  return { isSucess, isLoading, error, register };
}
