"use client";

import { signOut } from "next-auth/react";

import { Button } from "./ui/button";

export const SignOutButton = () => {
  return (
    <Button variant="link" onClick={() => void signOut()}>
      Logg ut
    </Button>
  );
};
