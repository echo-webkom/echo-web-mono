"use client";

import { type ComponentProps } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteAccessRequestAction } from "../_actions/delete-access-request";

type DeleteAccessRequestButtonProps = ComponentProps<typeof Button> & {
  accessRequestId: string;
};

export const DeleteAccessRequestButton = ({
  accessRequestId,
  children,
  ...props
}: DeleteAccessRequestButtonProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteAccessRequest = async () => {
    await deleteAccessRequestAction(accessRequestId);

    toast({
      title: "Forespørsel slettet",
      variant: "success",
    });

    router.refresh();
  };

  return (
    <Button {...props} onClick={handleDeleteAccessRequest} variant="destructive">
      {children}
    </Button>
  );
};
