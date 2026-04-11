"use client";

import { type SiteFeedback } from "@echo-webkom/db/schemas";
import { Mail, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toggleReadFeedback } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { shortDate } from "@/utils/date";
import { mailTo } from "@/utils/prefixes";

// Site used to crash. This is a quick fix to find the bad date
const parseDate = (date: Date) => {
  try {
    return shortDate(date);
  } catch {
    return "Dårlig";
  }
};

export const Feedback = ({ feedback }: { feedback: SiteFeedback }) => {
  const router = useRouter();

  const handleToggleRead = async () => {
    const { success, message } = await toggleReadFeedback(feedback.id);

    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }

    router.refresh();
  };

  return (
    <div className="bg-card text-card-foreground h-full w-full max-w-xl space-y-2 overflow-hidden rounded-lg border px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs">{parseDate(feedback.createdAt)}</p>

          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          <h3 className="font-medium">Navn: {feedback.name || "Ukjent"}</h3>
        </div>

        <Button
          size="icon"
          onClick={handleToggleRead}
          variant={feedback.isRead ? "outline" : "secondary"}
        >
          {feedback.isRead ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
        </Button>
      </div>

      <div>
        <p className="text-muted-foreground text-sm font-medium">
          E-post: <EmailLink email={feedback.email} />
        </p>
        <p className="text-muted-foreground text-sm font-medium">Tema: {feedback.category}</p>
      </div>

      <hr />

      <div>
        <p className="text-card-foreground text-sm wrap-break-word">
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
