import { ArrowLeft, ArrowRight, Settings, Undo } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  prev: () => void;
  next: () => void;
  reset?: () => void;
  toggleOptions: () => void;
};

export const CalendarControl = ({ prev, next, reset, toggleOptions }: Props) => {
  return (
    <div className="flex items-center gap-1">
      {reset && (
        <Button variant="outline" size="icon" onClick={reset}>
          <Undo className="size-4" />
        </Button>
      )}
      <Button variant="outline" size="icon" onClick={prev}>
        <ArrowLeft className="size-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={next}>
        <ArrowRight className="size-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={toggleOptions}>
        <Settings className="size-4" />
      </Button>
    </div>
  );
};
