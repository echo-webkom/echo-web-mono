import { useState } from "react";
import { z } from "zod";

const responseSchema = z.object({
  title: z.string(),
});

type Data = {
  status: string;
  reason?: string;
};

type EditRegistrationOpts = {
  onSuccess?: (data: z.infer<typeof responseSchema>) => void;
  onError?: (error: string) => void;
};

export function useEditregistration(slug: string, registrationUserId: string, { onSuccess, onError }: EditRegistrationOpts) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  async function editRegistration(input: Data) {
    setIsLoading(true);


    try {
      const response = await fetch(`/api/happening/${slug}/editregistration/${registrationUserId}`, {
        method: "PUT",
        body: JSON.stringify(input),
      });

      const data = responseSchema.parse(await response.json());

      if (response.ok) {
        onSuccess?.(data);
        setIsSuccess(true);
        return data;
      } else {
        setError(data.title);
        return null;
      }
    } catch (err) {
      setError("Noe gikk galt");
      onError?.("Noe gikk galt");
    } finally {
      setIsLoading(false);
    }
  }

  return { isSuccess, isLoading, error, editRegistration };
}
