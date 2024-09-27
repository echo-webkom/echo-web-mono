"use client";

import { Button } from "./ui/button";

export const SignOutButton = () => {
  return (
    <Button variant="link" asChild>
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`}>Logg ut</a>
    </Button>
  );
};
