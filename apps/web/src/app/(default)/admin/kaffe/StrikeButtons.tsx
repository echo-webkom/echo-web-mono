"use client";

import { useRouter } from "next/navigation";

import { addKaffeReport, resetKaffeStrikes } from "@/actions/kaffe-strikes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function StrikeButtons() {
  const { toast } = useToast();
  const router = useRouter();

  const handleAddReport = async () => {
    const success = await addKaffeReport();

    const title = success ? "Rapport lagt inn" : "Noe gikk galt";

    toast({
      title,
    });

    if (success) {
      router.refresh();
    }
  };

  const handleReset = async () => {
    const success = await resetKaffeStrikes();

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
      <Button onClick={handleAddReport}>Legg inn rapport</Button>
      <Button onClick={handleReset} variant="destructive">
        Resett prikker
      </Button>
    </div>
  );
}
