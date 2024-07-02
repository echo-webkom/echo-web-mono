"use client";

import { type ComponentProps } from "react";

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

  const handleDeleteAccessRequest = async () => {
    await deleteAccessRequestAction(accessRequestId);

    toast({
      title: "Forespørsel slettet",
      variant: "success",
    });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Button {...props} onClick={handleDeleteAccessRequest} variant="destructive">
      {children}
    </Button>
  );
};
