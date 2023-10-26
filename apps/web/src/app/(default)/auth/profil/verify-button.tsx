"use client";

import { useRouter } from "next/navigation";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

import { verifyFeide } from "@/actions/verify-feide";
import { useToast } from "@/hooks/use-toast";

type Props = {
  verified: boolean;
};

export function VerifyButton({ verified }: Props) {
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
    <div className="flex items-center gap-2">
      {verified ? (
        <>
          <p>Profilen din er verifisert!</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-md border">
            <CheckIcon className="h-6 w-6 rounded-sm bg-green-600 text-white" />
          </div>
        </>
      ) : (
        <>
          <p>Trykk her {"-->"}</p>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <button onClick={handleClick} className="h-8 w-8 rounded-md border p-2">
            <Cross1Icon className="h-full w-full text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
}
