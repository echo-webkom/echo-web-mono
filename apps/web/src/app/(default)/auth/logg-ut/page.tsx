import { redirect } from "next/navigation";

import { Container } from "@/components/container";
import { getSession } from "@/lib/session";
import { SignOutForm } from "./sign-out-form";

export default async function SignInPage() {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  return (
    <Container className="max-w-xl space-y-8 py-24">
      <SignOutForm />
    </Container>
  );
}
