import { useState } from "react";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { getFullHappening } from "@/data/happenings/queries";
import { type RegistrationWithUser } from "./registration-table";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

type RemoveAllRegistrationsButtonProps = {
  registrations: Array<RegistrationWithUser>;
  slug: string;
};

export async function RemoveAllRegistrationsButton({
  registrations,
  slug,
}: RemoveAllRegistrationsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const happening = await getFullHappening(slug);

  const getRegisteredUsers = () => {
    return registrations.filter((registration) => registration.status === "registered");
  };

  const removeAllRegistrations = () => {
    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.length === 0) {
      return;
    }
    removeRegistrations(registeredUsers);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const removeRegistrations = await db.delete.registrations.findMany({
    where: (registration: string) => eq(registration.happeningId, happening.id),
    with: {
      user: {
        with: {
          memberships: {
            with: {
              group: true,
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Button onClick={removeAllRegistrations}> Fjern alle påmeldinger </Button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <Button onClick={closeDialog}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
