"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuWrench as Wrench } from "react-icons/lu";

import { devtoolsLogin } from "@/actions/devtools-login";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PREMADE_USERS = [
  { id: "student", label: "Student", description: "student@echo.uib.no" },
  { id: "admin", label: "Webkom (admin)", description: "webkom@echo.uib.no" },
] as const;

export function DevtoolsLoginDialog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleLogin = async (userId: string) => {
    setIsLoading(userId);
    setError(null);

    try {
      const result = await devtoolsLogin(userId);

      if (result.success) {
        setOpen(false);
        router.push("/");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("En feil oppstod.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-700"
        >
          <Wrench className="h-4 w-4" />
          Devtools
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Devtools</DialogTitle>
          <DialogDescription>
            Logg inn som en forhåndsdefinert eller egendefinert bruker.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Text size="sm" className="font-semibold">
              Forhåndsdefinerte brukere
            </Text>
            {PREMADE_USERS.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-between"
                disabled={isLoading !== null}
                onClick={() => handleLogin(user.id)}
              >
                <span>{user.label}</span>
                <span className="text-muted-foreground text-xs">{user.description}</span>
              </Button>
            ))}
          </div>

{error && (
            <Text size="sm" className="text-red-600">
              {error}
            </Text>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
