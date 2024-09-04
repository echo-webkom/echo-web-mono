"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";

import { removeAllRegistrations } from "@/actions/remove-all-registrations";
import { Button } from "@/components/ui/button";

type RemoveAllRegistrationsButtonProps = {
  slug: string;
};

export const RemoveAllRegistrationsButton = ({ slug }: RemoveAllRegistrationsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };
  const openDialog = () => {
    setIsOpen(true);
  };

  const handleRemoveAllRegistrations = async () => {
    await removeAllRegistrations(slug);
    setLoading(true);
  };

  return (
    <>
      <Button onClick={openDialog}> Fjern alle påmeldinger </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <Button onClick={handleRemoveAllRegistrations} disabled={loading}></Button>
            <Button onClick={closeDialog}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
