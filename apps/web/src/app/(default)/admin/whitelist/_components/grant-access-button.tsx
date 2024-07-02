"use client";

import { type ComponentProps } from "react";

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

  const handleGrantAccess = async () => {
    await grantAccessAction(accessRequestId);

    toast({
      title: "Tilgang gitt",
      variant: "success",
    });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Button {...props} onClick={handleGrantAccess} variant="secondary">
      {children}
    </Button>
  );
};
