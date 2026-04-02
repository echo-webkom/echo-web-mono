"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { deleteAccessRequestAction } from "../_actions/delete-access-request";

type DenyAccessModalProps = {
  accessRequestId: string;
  children: React.ReactNode;
};

export const DenyAccessModal = ({ accessRequestId, children }: DenyAccessModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const close = () => {
    setIsOpen(false);
    setReason("");
  };

  const handleDenyAccess = () => {
    if (!reason.trim()) {
      toast.error("Begrunnelse påkrev", {
        description: "Du må oppgi en begrunnelse for å avslå tilgang",
      });
      return;
    }

    startTransition(async () => {
      try {
        await deleteAccessRequestAction(accessRequestId, reason.trim());

        toast.success("Tilgang avslått", {
          description: "Forespørselen har blitt avslått og brukeren har fått beskjed",
        });

        router.refresh();
        close();
      } catch {
        toast.error("Feil", {
          description: "Kunne ikke avslå tilgang. Prøv igjen.",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avslå tilgang</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deny-reason" required>
                Begrunnelse for avslag
              </Label>
              <Textarea
                id="deny-reason"
                placeholder="Skriv hvorfor tilgang blir avslått..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button onClick={close} size="sm" type="button" disabled={isPending}>
            Avbryt
          </Button>
          <Button
            onClick={handleDenyAccess}
            size="sm"
            type="button"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? "Avslår..." : "Avslå tilgang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
