import { redirect } from "next/navigation";

import { Container } from "@/components/container";
import { getSession } from "@/lib/session";
import { CreateAccountForm } from "./create-account-form";

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    return redirect("/auth/profil");
  }

  return (
    <Container className="max-w-2xl">
      <CreateAccountForm />
    </Container>
  );
}
