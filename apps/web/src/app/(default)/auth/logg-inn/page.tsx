import { redirect } from "next/navigation";

import { Container } from "@/components/container";
import { getJwtPayload } from "@/lib/session";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const session = await getJwtPayload();

  if (session) {
    return redirect("/auth/profil");
  }

  return (
    <Container>
      <SignInForm />
    </Container>
  );
}
