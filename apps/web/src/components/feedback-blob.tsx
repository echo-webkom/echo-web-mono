import Link from "next/link";
import { MdOutlineFeedback } from "react-icons/md";

import { Button } from "./ui/button";

export const FeedbackBlob = () => {
  return (
    <Button size="icon-lg" className="fixed bottom-0 right-0 z-30 m-5 rounded-full">
      <Link href="/tilbakemelding" data-testid="feedback-button">
        <MdOutlineFeedback className="h-6 w-6 text-white" />
      </Link>
    </Button>
  );
};
