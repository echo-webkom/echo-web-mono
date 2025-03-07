"use client";

import { useEffect, useState } from "react";
import { isToday } from "date-fns";
import { useSession } from "next-auth/react";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

/**
 * Membership fee modal for to notify the user about paying the membership fee.
 * Meant as a april fools joke.
 */

const isAprilFoolsToday = isToday(new Date(2025, 3, 1));

export const MembershipFeeModal = () => {
  const session = useSession();
  const [reveal, setReveal] = useState(false);
  const [open, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const name = session.data?.user.name;

  const toggleReveal = () => {
    setReveal(!reveal);
  };

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      localStorage.setItem("joke-modal-seen", "true");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("joke-modal-seen", "true");
  };

  if (!isMounted || !isAprilFoolsToday) {
    return null;
  }

  const hasSeenModal = window?.localStorage.getItem("joke-modal-seen") === "true";

  if (hasSeenModal) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Manglende betaling for medlemskontigent
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <p>
            Hei <b>{name}</b>, vi ser at du ikke har betalt medlemskontigenten for 2025. Dette er en
            påminnelse om at du må betale denne for å kunne fortsette å være medlem i echo.
          </p>
          <p>
            Du kan betale medlemskontigenten ved å overføre <b>1000 kr</b> til kontonummer:{" "}
            <button
              onClick={toggleReveal}
              className="rounded-md bg-footer px-2 font-mono text-sm text-foreground"
            >
              {reveal ? "Aprilsnarr!!" : "Klikk for å vise"}
            </button>
            . Merk betalingen med &quot;Medlemskontigent 2025&quot;.
          </p>
          <p>
            Om du ikke betaler innen 1. april vil du bli kastet ut av echo og kan ikke lengre delta
            på våre fantastiske arrangementer.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm" variant="ghost" onClick={handleClose}>
              Lukk
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
