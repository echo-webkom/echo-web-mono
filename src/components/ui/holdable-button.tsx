import { useState, type MouseEventHandler } from "react";

import { Button, type ButtonProps } from "./button";

export type HoldableButtonProps = ButtonProps & {
  holdDelay?: number;
  onHold?: MouseEventHandler<HTMLButtonElement>;
};

export const HoldableButton = ({
  holdDelay = 1000,
  onHold,
  onClick,
  ...props
}: HoldableButtonProps) => {
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);

  const handleMouseDown = () => {
    setPressStartTime(Date.now());
  };

  const handleMouseUp: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (pressStartTime === null) return;

    const pressDuration = Date.now() - pressStartTime;

    if (pressDuration >= holdDelay) {
      onHold?.(e);
    } else {
      onClick?.(e);
    }
  };

  return <Button {...props} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />;
};
