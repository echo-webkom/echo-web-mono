"use server";

import { useState } from "react";
import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { registrations } from "@echo-webkom/db/schemas";

import { getFullHappening } from "@/data/happenings/queries";
import { getUser } from "@/lib/get-user";
import { isHost, isWebkom } from "@/lib/memberships";

type RemoveAllRegistrationsButtonProps = {
  slug: string;
};

export const RemoveAllRegistrationsButton = ({ slug }: RemoveAllRegistrationsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

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

      const registeredUsers =  await db.query.registrations.findMany({
        where: (registration) =>
            and(eq(registration.happeningId, happening.id), eq(registration.status, "registered")),
          with: {
            happening: {
              with: {
                groups: true,
              },
            },
            user: true,
          },
        });
        
        if (!registeredUsers) {
            return {
              success: false,
              message: "No registered users",
            };
          }

      await db.delete(registrations).where(eq(registrations.happeningId, happening.id));
      setIsOpen(false);
    } catch (error) {
      return {
        success: false,
        message: error.message,
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
