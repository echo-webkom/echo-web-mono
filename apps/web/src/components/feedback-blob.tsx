import { MessageSquareWarning } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";

export const FeedbackBlob = () => {
  return (
    <Button size="icon-lg" className="fixed right-0 bottom-0 z-30 m-5 rounded-full">
      <Link href="/tilbakemelding" data-testid="feedback-button">
        <MessageSquareWarning className="h-6 w-6 text-white" />
      </Link>
    </Button>
  );
};
