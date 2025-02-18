"use client";

import { useState, useTransition } from "react";

import { Text } from "@/components/typography/text";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ConfirmationModalProps = {
  onConfirmAction: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  children: React.ReactNode;
  confirmVariant?: ButtonProps["variant"];
};

export const ConfirmationModal = ({
  title,
  description,
  confirmText,
  onConfirmAction,
  children,
  confirmVariant,
}: ConfirmationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [_, startTransition] = useTransition();

  const close = () => setIsOpen(false);

  const handleConfirm = () => {
    startTransition(async () => {
      await onConfirmAction();
    });

    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-fit" asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>{description}</Text>
        </DialogBody>
        <DialogFooter>
          <Button onClick={close} size="sm" type="button">
            Avbryt
          </Button>
          <Button size="sm" type="submit" onClick={handleConfirm} variant={confirmVariant}>
            {confirmText ?? "Bekreft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
