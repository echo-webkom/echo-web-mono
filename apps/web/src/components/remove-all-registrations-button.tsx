import { useState } from "react";

import { deregister } from "@/actions/deregister";
import { getFullHappening } from "@/data/happenings/queries";
import { type RegistrationWithUser } from "./registration-table";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

type RemoveAllRegistrationsButtonProps = {
  registrations: Array<RegistrationWithUser>;
  slug: string;
};

export const RemoveAllRegistrationsButton = ({
  registrations,
  slug,
}: RemoveAllRegistrationsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRegisteredUsers = () => {
    return registrations.filter((r) => r.status === "registered");
  };

  const removeAllRegistrations = async () => {
    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.length === 0) {
      return;
    }
    try {
      const happening = await getFullHappening(slug);
      if (!happening) {
        console.error("Happening not found");
        return;
      }

      for (const regUser of registeredUsers) {
        await deregister(regUser.user.id, { reason: "Removed by host" });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error removing registrations:", error);
    }
  };
  const closeDialog = () => {
    setIsOpen(false);
  };
  const openDialog = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button onClick={openDialog}> Fjern alle påmeldinger </Button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <Button onClick={removeAllRegistrations}>Ja, fjern alle</Button>
            <Button onClick={closeDialog}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
