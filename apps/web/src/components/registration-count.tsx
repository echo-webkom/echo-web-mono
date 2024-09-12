/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { BiInfinite } from "react-icons/bi";

type RegistrationCountProps = {
  registeredCount: number;
  maxCapacity: number | null;
};

export const RegistrationCount = ({ maxCapacity, registeredCount }: RegistrationCountProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {Math.min(registeredCount, maxCapacity || Number.POSITIVE_INFINITY)} /{" "}
        {maxCapacity || <BiInfinite className="h-5 w-5" />}
      </div>
    </div>
  );
};
