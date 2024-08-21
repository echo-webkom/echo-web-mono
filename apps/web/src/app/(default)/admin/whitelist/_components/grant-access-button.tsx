"use client";

import { type ComponentProps } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { grantAccessAction } from "../_actions/grant-access";

type GrantAccessButtonProps = ComponentProps<typeof Button> & {
  accessRequestId: string;
};

export const GrantAccessButton = ({
  accessRequestId,
  children,
  ...props
}: GrantAccessButtonProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleGrantAccess = async () => {
    const { message, success } = await grantAccessAction(accessRequestId);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    router.refresh();
  };

  return (
    <Button {...props} onClick={handleGrantAccess} variant="secondary">
      {children}
    </Button>
  );
};
