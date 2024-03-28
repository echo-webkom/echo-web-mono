"use client";

import { useRouter } from "next/navigation";

import { addKaffeReport, resetKaffeStrikes } from "@/actions/kaffe-strikes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function StrikeButtons() {
  const { toast } = useToast();
  const router = useRouter();

  const handleAddReport = async () => {
    const success = await addKaffeReport(undefined);

    const title = success ? "Rapport lagt inn" : "Noe gikk galt";

    toast({
      title,
    });

    if (success) {
      router.refresh();
    }
  };

  const handleReset = async () => {
    const success = await resetKaffeStrikes(undefined);

    const title = success ? "Prikker resatt" : "Noe gikk galt";

    toast({
      title,
    });

    if (success) {
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button onClick={handleAddReport}>Legg inn rapport</Button>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button onClick={handleReset} variant="destructive">
        Resett prikker
      </Button>
    </div>
  );
}
