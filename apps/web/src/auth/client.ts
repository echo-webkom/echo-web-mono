"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import ky from "ky";

type SignOutOptions = {
  redirectUrl?: string;
};

export function useSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(
    async (options: SignOutOptions = {}) => {
      const url = options.redirectUrl ?? "/";
      setIsSigningOut(true);
      try {
        await ky.post("/api/auth/sign-out");
        router.push(url);
        router.refresh();
      } catch (error) {
        console.error("Sign out failed:", error);
      } finally {
        setIsSigningOut(false);
      }
    },
    [router],
  );

  return { signOut, isSigningOut };
}
