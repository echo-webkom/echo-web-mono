"use client";

import { useRouter } from "next/navigation";

import { addStrikeToKitchen, clearAllStrikes } from "@/actions/kitchen-strike";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AdminButtonClient() {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddStrike = async () => {
    const { success, message } = await addStrikeToKitchen();

    toast({
      title: success ? "Anmerkning lagt til" : "Noe gikk galt",
      description: message,
      variant: success ? "success" : "destructive",
    });

    router.refresh();
  };

  const handleClearStrikes = async () => {
    const { success, message } = await clearAllStrikes();

    toast({
      title: success ? "Alle anmerkninger fjernet" : "Noe gikk galt",
      description: message,
      variant: success ? "success" : "destructive",
    });

    router.refresh();
  };

  return (
    <div className="my-2 flex flex-col gap-2 sm:flex-row">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button onClick={handleAddStrike}>Legg til anmerkning</Button>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button onClick={handleClearStrikes}>Fjern alle anmerkninger</Button>
    </div>
  );
}
