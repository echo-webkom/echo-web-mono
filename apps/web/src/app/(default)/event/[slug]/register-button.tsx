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

    switch (response.status) {
      case 201:
        toast({
          title: "Du er påmeldt!",
          description: "Gratulere, du fikk plass på arrangementet!",
        });
        break;
      case 202:
        toast({
          title: "Du er påmeldt!",
          description: "Du er nå på venteliste.",
        });
        break;
      case 404:
        toast({
          title: "Arrangementet finnes ikke!",
          description: "Arrangementet du prøver å melde deg på finnes ikke.",
        });
      case 422:
        toast({
          title: "Du er allerede påmeldt!",
          description: "Du er allerede påmeldt til dette arrangementet.",
        });
        break;
    }

    router.refresh();
  }

  return (
    <Button disabled={isLoading} onClick={() => void handleRegister()} fullWidth>
      {isLoading ? "Melder deg på..." : "Meld deg på"}
    </Button>
  );
}
