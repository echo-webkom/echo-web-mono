"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";

export default function RegisterButton({slug}: {slug: string}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  async function handleRegister() {
    setIsLoading(true);

    const response = await fetch(`/api/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
    });

    setIsLoading(false);

    const data = await response.text();

    toast({
      description: data,
      variant: response.status < 400 ? "success" : "warning",
    });

    router.refresh();
  }

  return (
    <Button disabled={isLoading} onClick={() => void handleRegister()} fullWidth>
      {isLoading ? "Melder deg på..." : "Meld deg på"}
    </Button>
  );
}
