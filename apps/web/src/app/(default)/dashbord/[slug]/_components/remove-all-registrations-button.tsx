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
  const [error, setError] = useState<string | null>(null);

  const closeDialog = () => {
    setIsOpen(false);
  };
  const openDialog = () => {
    setIsOpen(true);
  };

  const handleRemoveAllRegistrations = async () => {
    await removeAllRegistrations(slug);
    setLoading(true);
    setError(null);
  };

  return (
    <>
      <Button onClick={openDialog}> Fjern alle påmeldinger </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button onClick={handleRemoveAllRegistrations} disabled={loading}></Button>
            <Button onClick={closeDialog}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
