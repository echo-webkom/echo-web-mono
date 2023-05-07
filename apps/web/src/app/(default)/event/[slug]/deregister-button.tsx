"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";

export default function DeregisterButton({slug}: {slug: string}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  async function handleDeregister() {
    setIsLoading(true);

    const response = await fetch(`/api/happening/${slug}/deregister`, {
      method: "POST",
      body: JSON.stringify({
        reason: "fordi lol",
      }),
    });

    setIsLoading(false);

    switch (response.status) {
      case 200:
        toast({
          title: "Du er avmeldt!",
          description: "Du er nå avmeldt fra arrangementet.",
          variant: "success",
        });
        break;
      case 404:
        toast({
          title: "Arrangementet finnes ikke!",
          description: "Arrangementet du prøver å melde deg på finnes ikke.",
          variant: "destructive",
        });
      case 400:
        toast({
          title: "Du er allerede påmeldt!",
          description: "Du er allerede påmeldt til dette arrangementet.",
          variant: "warning",
        });
        break;
    }

    router.refresh();
  }

  return (
    <Button disabled={isLoading} onClick={() => void handleDeregister()} fullWidth>
      {isLoading ? "Melder deg av..." : "Meld deg av"}
    </Button>
  );
}
