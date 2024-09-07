"use client";

import { useState } from "react";

import { removeAllRegistrations } from "@/actions/remove-all-registrations";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";

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
    closeDialog();
  };

  return (
    <>
      <Button onClick={openDialog}> Fjern alle påmeldinger </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogBody>
              <Text className="border-b-2 p-10 text-center text-2xl">
                Er du sikker på at du vil fjerne alle påmeldinger?
              </Text>
            </DialogBody>
            <DialogFooter>
              <div className="flex w-full justify-between">
                <Button onClick={handleRemoveAllRegistrations} variant="default">
                  Ja, fjern alle
                </Button>
                <Button variant="secondary" onClick={closeDialog}>
                  Avbryt
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
