import {useCallback, useState} from "react";
import {z} from "zod";

const responseSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type Data = {
  questions: Array<{
    question: string;
    answer?: string;
  }>;
};

type RegisterOpts = {
  onSuccess?: (data: z.infer<typeof responseSchema>) => void;
  onError?: (error: string) => void;
};

export function useRegistration(slug: string, {onSuccess, onError}: RegisterOpts) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSucess, setIsSucess] = useState<boolean>(false);

  const register = useCallback(
    async (input: Data) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/happening/${slug}/register`, {
          method: "POST",
          body: JSON.stringify(input),
        });
        const data = responseSchema.parse(await response.json());

        if (response.ok) {
          setIsSucess(true);
          onSuccess?.(data);
        } else {
          setError(data.description);
          onError?.(data.description);
        }
      } catch (err) {
        setError("Noe gikk galt");
        onError?.("Noe gikk galt");
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug],
  );

  return {isSucess, isLoading, error, register};
}
