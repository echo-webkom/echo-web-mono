"use client";

import { Chip } from "./typography/chip";

type ActionChipProps = {
  action: string;
  children: React.ReactNode;
};

export const ActionChip = ({ action, children }: ActionChipProps) => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("easter-egg-action", { detail: action }));
  };

  return (
    <button className="z-50 cursor-pointer" onClick={handleClick}>
      <Chip>{children}</Chip>
    </button>
  );
};
