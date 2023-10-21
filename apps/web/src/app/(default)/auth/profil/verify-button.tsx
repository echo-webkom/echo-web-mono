"use client";

import { useRouter } from "next/navigation";
import { Cross1Icon } from "@radix-ui/react-icons";

import { verifyFeide } from "@/actions/veriy-feide";
import { useToast } from "@/hooks/use-toast";

export function VerifyButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = async () => {
    const { message, success } = await verifyFeide();

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <p>Trykk her {"-->"}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button onClick={handleClick} className="h-8 w-8 rounded-md border p-2">
        <Cross1Icon className="h-full w-full text-gray-800" />
      </button>
    </div>
  );
}
