"use client";

import { type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { grantAccessAction } from "../_actions/grant-access";

type GrantAccessButtonProps = ComponentProps<typeof Button> & {
  accessRequestId: string;
};

export const GrantAccessButton = ({
  accessRequestId,
  children,
  ...props
}: GrantAccessButtonProps) => {
  const router = useRouter();

  const handleGrantAccess = async () => {
    const { message, success } = await grantAccessAction(accessRequestId);

    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }

    router.refresh();
  };

  return (
    <Button {...props} onClick={handleGrantAccess} variant="secondary">
      {children}
    </Button>
  );
};
