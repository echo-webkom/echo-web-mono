import { BiUndo } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
          <BiUndo />
        </Button>
      )}
      <Button variant="outline" className="mr-1" onClick={prev}>
        <FaArrowLeft />
      </Button>
      <Button variant="outline" onClick={next}>
        <FaArrowRight />
      </Button>
    </div>
  );
};
