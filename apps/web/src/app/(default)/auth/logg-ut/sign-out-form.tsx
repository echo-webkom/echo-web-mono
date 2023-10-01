"use client";

import { Button } from "@/components/ui/button";
import { logOutAction } from "./actions";

export function SignOutForm() {
  const handleSignOut = () => {
    void logOutAction();
  };

  return (
    <>
      <h1 className="text-center text-2xl">Er du sikker på at du vil logge ut?</h1>
      <Button onClick={handleSignOut}>Logg ut</Button>
    </>
  );
}
