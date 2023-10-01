import { redirect } from "next/navigation";

import { Container } from "@/components/container";
import { getSession } from "@/lib/session";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    return redirect("/auth/profil");
  }

  return (
    <Container>
      <SignInForm />
    </Container>
  );
}
