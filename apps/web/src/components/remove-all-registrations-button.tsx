import { useState } from "react";

import { getFullHappening } from "@/data/happenings/queries";
import { type RegistrationWithUser } from "./registration-table";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { usersRelations } from "@echo-webkom/db/schemas";
import { getUser } from "@/lib/get-user";
import { eq } from "drizzle-orm";

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

  const user = await getUser();

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

      const userGroupIds = user?.memberships.map((membership) => membership.groupId);
      const organizerGroupIds = happening.organizers.map((organizer) => organizer.id);
      const isAuthorized = userGroupIds.includes("webkom") || userGroupIds.some((groupId) => organizerGroupIds.includes(groupId));

      if (!isAuthorized) {
        console.error("User is not authorized to remove registrations");
        return;
      }

      await db.delete(registrations).where(eq(registrations.happeningId, happening.id));
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
