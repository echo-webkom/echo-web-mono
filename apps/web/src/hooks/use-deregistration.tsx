import {useCallback, useState} from "react";
import {z} from "zod";

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

export function useDeregistration(slug: string, {onSuccess, onError}: RegisterOpts) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSucess, setIsSucess] = useState<boolean>(false);

  const deregister = useCallback(
    async (input: Data) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/happening/${slug}/deregister`, {
          method: "POST",
          body: JSON.stringify(input),
        });
        const data = responseSchema.parse(await response.json());

        if (response.ok) {
          setIsSucess(true);
          onSuccess?.(data);
        } else {
          setError(data.title);
          onError?.(data.title);
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

  return {isSucess, isLoading, error, deregister};
}
