import { redirect } from "next/navigation";

import { Container } from "@/components/container";
import { getJwtPayload } from "@/lib/session";
import { CreateAccountForm } from "./create-account-form";

export default async function SignInPage() {
  const session = await getJwtPayload();

  if (session) {
    return redirect("/auth/profil");
  }

  return (
    <Container className="max-w-2xl">
      <CreateAccountForm />
    </Container>
  );
}
