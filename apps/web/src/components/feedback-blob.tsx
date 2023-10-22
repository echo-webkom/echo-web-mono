import Link from "next/link";
import { MdOutlineFeedback } from "react-icons/md";

export function FeedbackBlob() {
  return (
    <Link href="/tilbakemelding" data-testid="feedback-button">
      <div className="hover:bg-primary-hover fixed bottom-0 right-0 z-30 m-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md transition-colors duration-300 focus:ring focus:ring-primary focus:ring-offset-2">
        <MdOutlineFeedback className="h-6 w-6 text-white" />
      </div>
    </Link>
  );
}
