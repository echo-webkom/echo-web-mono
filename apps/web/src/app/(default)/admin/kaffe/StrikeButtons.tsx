"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addKaffeReportAction, resetKaffeStrikesAction } from "./_actions";

export const StrikeButtons = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { executeAsync: addExecuteAsync } = useAction(addKaffeReportAction);
  const { executeAsync: resetExecuteAsync } = useAction(resetKaffeStrikesAction);

  const handleAddReport = async () => {
    const response = await addExecuteAsync();
    const success = !!response?.data;
    const title = success ? "Rapport lagt inn" : "Noe gikk galt";

    toast({
      title,
      variant: success ? "success" : "destructive",
    });

    if (success) {
      router.refresh();
    }
  };

  const handleReset = async () => {
    const response = await resetExecuteAsync();
    const success = !!response?.data;

    const title = success ? "Prikker resatt" : "Noe gikk galt";

    toast({
      title,
      variant: success ? "success" : "destructive",
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
};
