"use client";

import { createContext, useContext } from "react";

type RegistrationTableContextType = {
  headers: Array<string>;
  selectedHeaders: Array<string>;
  setSelectedHeaders: React.Dispatch<React.SetStateAction<Array<string>>>;
};

export const RegistrationTableContext = createContext<RegistrationTableContextType | null>(null);

export const useRegistrationTable = () => {
  const context = useContext(RegistrationTableContext);

  if (!context) {
    throw new Error("useRegistrationTable must be used within a RegistrationTableProvider");
  }

  return context;
};
