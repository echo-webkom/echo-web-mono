"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
import { useToast } from "@/hooks/use-toast";
import { deleteAccessRequestAction } from "../_actions/delete-access-request";

type DenyAccessModalProps = {
  accessRequestId: string;
  children: React.ReactNode;
};

export const DenyAccessModal = ({ accessRequestId, children }: DenyAccessModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const close = () => {
    setIsOpen(false);
    setReason("");
  };

  const handleDenyAccess = () => {
    if (!reason.trim()) {
      toast({
        title: "Begrunnelse påkrevd",
        description: "Du må oppgi en begrunnelse for å avslå tilgang",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        await deleteAccessRequestAction(accessRequestId, reason.trim());

        toast({
          title: "Tilgang avslått",
          description: "Forespørselen har blitt avslått og brukeren har fått beskjed",
          variant: "success",
        });

        router.refresh();
        close();
      } catch {
        toast({
          title: "Feil",
          description: "Kunne ikke avslå tilgang. Prøv igjen.",
          variant: "destructive",
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
