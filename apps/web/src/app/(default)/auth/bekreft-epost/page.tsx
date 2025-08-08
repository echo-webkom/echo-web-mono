import { Suspense } from "react";

import { Heading } from "@/components/typography/heading";
import VerifyEmailForm from "./verify-email-form";

export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto max-w-md py-8">
      <div className="rounded-lg border bg-muted p-8 shadow-sm">
        <Heading level={3} className="mb-6 text-center">
          Bekreft e-postadresse
        </Heading>

        <Suspense fallback={<div>Laster...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
