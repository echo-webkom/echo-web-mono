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

  const closeDialog = () => {
    setIsOpen(false);
  };
  const openDialog = () => {
    setIsOpen(true);
  };

  const handleRemoveAllRegistrations = async () => {
    await removeAllRegistrations(slug);
  };

  return (
    <>
      <Button onClick={openDialog}> Fjern alle påmeldinger </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Button onClick={handleRemoveAllRegistrations}>Er du sikker? </Button>
              <button
                onClick={closeDialog}
                className="absolute right-1 top-0 cursor-pointer border-none bg-none text-lg hover:text-red-500"
              >
                &times;
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
