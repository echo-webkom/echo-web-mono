"use client";

import { useContext } from "react";

import { AuthContext } from "@/provides/auth";

export function useAuth() {
  const ctx = useContext(AuthContext);

  return ctx;
}
