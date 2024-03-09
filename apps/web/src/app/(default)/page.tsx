import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { auth } from "@echo-webkom/auth";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Content } from "./content";

export default async function HomePage() {
  const user = await auth();

  return (
    <>
      <div className="px-4">
        <div className="rainbow flex items-center justify-between rounded-lg p-6 shadow-lg">
          <FaArrowRight className="animate-bounce-left h-6 w-6" />
          <p className="text-center text-lg font-medium sm:text-3xl">
            Husk å stemme i hovedstyre-valget!!
          </p>
          <FaArrowLeft className="animate-bounce-right h-6 w-6" />
        </div>
      </div>

      <Container className="relative pb-40" layout="full">
        <div className="mx-auto w-full max-w-screen-xl py-10">
          <div className="max-w-xl space-y-8">
            <h1>
              <span className="text-xl font-medium sm:text-3xl">Velkommen til</span>
              <br />
              <span className="text-4xl font-bold sm:text-5xl">
                echo – Linjeforeningen for informatikk
              </span>
            </h1>
            <p>
              Vi i echo jobber med å gjøre studiehverdagen for informatikkstudenter bedre ved å
              arrangere sosiale og faglige arrangementer.
              <br /> Les mer{" "}
              <Link
                className="font-semibold underline underline-offset-2 hover:text-primary"
                href="/om/echo"
              >
                her.
              </Link>
            </p>
            <div>
              <Button asChild variant="secondary">
                {user ? (
                  <Link href="/auth/profil">Min profil</Link>
                ) : (
                  <Link href="/auth/logg-inn">Logg inn</Link>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <Content />
    </>
  );
}
