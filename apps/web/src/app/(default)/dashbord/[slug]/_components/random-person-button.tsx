"use client";

import { useState } from "react";
import Confetti from "react-confetti";
import { AiOutlineLoading } from "react-icons/ai";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWindowSize } from "@/hooks/use-window-size";

type RandomPersonButtonProps = {
  registrations: Array<string>;
};

export const RandomPersonButton = ({ registrations }: RandomPersonButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { height, width } = useWindowSize();
  const [randomUserName, setRandomUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const pickRandomRegisteredUser = () => {
    setIsLoading(true);
    const i = Math.floor(Math.random() * registrations.length);
    const name = registrations[i];

    if (!name) {
      toast({
        title: "Ingen registrerte brukere",
        description: "Det er ingen som er påmeldt arrangementet.",
        variant: "warning",
      });
      setIsLoading(false);
      return;
    }
    setRandomUserName(name);

    setTimeout(() => {
      setIsOpen(true);
      setIsLoading(false);
    }, 1500); // 1.5 sekund delay
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Confetti className="fixed inset-0 z-60 h-full w-full" height={height} width={width} />
      )}

      <Button onClick={pickRandomRegisteredUser}>
        {isLoading ? (
          <>
            <span>
              <AiOutlineLoading className="h-4 w-4 animate-spin" />
            </span>
            <span className="px-2">Velger..</span>
          </>
        ) : (
          <span>Velg tilfeldig person</span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogBody>
            <Text className="p-10 text-center text-2xl">{randomUserName}</Text>
          </DialogBody>
          <DialogFooter>
            <Button onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
