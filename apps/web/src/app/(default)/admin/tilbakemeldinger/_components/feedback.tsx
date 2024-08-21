"use client";

import { RxEnvelopeClosed, RxEnvelopeOpen } from "react-icons/rx";

import { type SiteFeedback } from "@echo-webkom/db/schemas";

import { toggleReadFeedback } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { shortDate } from "@/utils/date";
import { mailTo } from "@/utils/prefixes";

// Site used to crash. This is a quick fix to find the bad date
const parseDate = (date: Date) => {
  try {
    return shortDate(date);
  } catch (e) {
    return "Dårlig";
  }
};

export const Feedback = ({ feedback }: { feedback: SiteFeedback }) => {
  const { toast } = useToast();

  const handleToggleRead = async () => {
    const { success, message } = await toggleReadFeedback(feedback.id);

    toast({
      title: message,
      variant: success ? "success" : "destructive",
    });
  };

  return (
    <div className="h-full w-full max-w-xl space-y-2 overflow-hidden rounded-lg border-2 bg-card px-4 py-5 text-card-foreground sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{parseDate(feedback.createdAt)}</p>

          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          <h3 className="font-medium">Navn: {feedback.name || "Ukjent"}</h3>
        </div>

        <Button
          size="icon"
          onClick={handleToggleRead}
          variant={feedback.isRead ? "outline" : "secondary"}
        >
          {feedback.isRead ? <RxEnvelopeOpen /> : <RxEnvelopeClosed />}
        </Button>
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          E-post: <EmailLink email={feedback.email} />
        </p>
        <p className="text-sm font-medium text-muted-foreground">Tema: {feedback.category}</p>
      </div>

      <hr />

      <div>
        <p className="break-words text-sm text-card-foreground">
          {/* Show line breaks */}
          {feedback.message.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

const EmailLink = ({ email }: { email: string | null }) => {
  if (!email) {
    return <span>Ukjent</span>;
  }

  return (
    <a href={mailTo(email)} className="hover:underline">
      {email}
    </a>
  );
};
