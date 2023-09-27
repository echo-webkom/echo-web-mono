"use client";

import { signOut } from "next-auth/react";

import { Button } from "./ui/button";

export function SignOutButton() {
  return (
    <Button variant="link" onClick={() => void signOut()}>
      Logg ut
    </Button>
  );
}
