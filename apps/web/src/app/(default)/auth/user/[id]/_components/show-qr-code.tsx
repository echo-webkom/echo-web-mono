"use client";

import { QrCodeIcon } from "lucide-react";
import QRCode from "react-qr-code";

import { Button } from "../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../../../../../../components/ui/dialog";
import { cn } from "../../../../../../utils/cn";

interface props {
  userId: string;
  className?: string;
}

export const ShowQrCode = ({ userId, className }: props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon-xl"} className={cn("", className)}>
          <QrCodeIcon size={"36"} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-none" showCloseButton={false}>
        <DialogHeader>
          <DialogDescription className="mx-auto">
            <QRCode size={250} bgColor="white" fgColor="black" value={userId} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
