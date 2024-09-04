import { useState } from "react";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { getFullHappening } from "@/data/happenings/queries";
import { getUser } from "@/lib/get-user";
import { isHost, isWebkom } from "@/lib/memberships";
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
    try {
      const happening = await getFullHappening(slug);
      if (!happening) {
        return {
          success: false,
          message: "Happening not found",
        };
      }

      const user = await getUser();
      if (!user || !isHost(user, happening) || !isWebkom(user)) {
        return {
          success: false,
          message: "Invalid user",
        };
      }

      const registeredUsers = getRegisteredUsers();
      if (registeredUsers.length === 0) {
        return {
          success: false,
          message: "No registered users",
        };
      }

      await db.delete(registrations).where(eq(registrations.happeningId, happening.id));
      setIsOpen(false);
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
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
