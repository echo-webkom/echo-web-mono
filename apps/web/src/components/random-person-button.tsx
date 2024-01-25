import { useState } from "react";
import Confetti from "react-confetti";
import { AiOutlineLoading } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { type RegistrationWithUser } from "./registration-table";

type RandomPersonButtonProps = {
  registrations: Array<RegistrationWithUser>;
};

export function RandomPersonButton({ registrations }: RandomPersonButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [randomUserName, setRandomUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getRegisteredUsers = () => {
    return registrations.filter((registration) => registration.status === "registered");
  };

  const pickRandomRegisteredUser = () => {
    setIsLoading(true);
    const registeredUsers = getRegisteredUsers();
    const randomIndex = Math.floor(Math.random() * registeredUsers.length);
    const randomUser = registeredUsers[randomIndex];
    const name = randomUser?.user.name ?? randomUser?.user.email ?? null;

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
      setShowConfetti(true);
      setIsLoading(false);
    }, 1500); // 1.5 sekund delay
  };

  const closeDialog = () => {
    setIsOpen(false);
    setShowConfetti(false);
  };

  return (
    <>
      <Confetti className="fixed left-0 top-0 z-[60] min-h-screen w-full" hidden={!showConfetti} />

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

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <Label className="p-10 text-center text-2xl">{randomUserName}</Label>
            <Button onClick={closeDialog}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
