import { ArrowLeft, ArrowRight, Undo } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  prev: () => void;
  next: () => void;
  reset?: () => void;
};

export const CalendarControl = ({ prev, next, reset }: Props) => {
  return (
    <div className="flex items-center">
      {reset && (
        <Button variant="outline" size="icon" onClick={reset} className="mr-2">
          <Undo className="size-4" />
        </Button>
      )}
      <Button variant="outline" size="icon" className="mr-1" onClick={prev}>
        <ArrowLeft className="size-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={next}>
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
};
