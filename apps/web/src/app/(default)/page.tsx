import Link from "next/link";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { Content } from "./content";

export default async function HomePage() {
  const session = await getSession();
  return (
    <>
      <Container className="relative pb-40 pt-24" layout="full">
        <div className="mx-auto w-full max-w-screen-xl">
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
              <Link className="font-semibold" href="/om/echo">her.</Link>
            </p>
            <div>
              <Button asChild variant="secondary">
                {session ? (
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
