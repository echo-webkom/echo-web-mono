"use client";

import { useSignOut } from "@/auth/client";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  const { signOut } = useSignOut();

  return (
    <Button onClick={() => void signOut()} variant="link">
      Logg ut
    </Button>
  );
};
