import Link from "next/link";

import { getAuth } from "@echo-webkom/auth";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Content } from "./content";

export default async function HomePage() {
  const session = await getAuth();

  return (
    <>
      <Container className="relative pb-40" layout="full">
        {/* New website announcment */}
        <div className="mx-auto mb-10 flex w-fit flex-row items-center gap-5 text-center">
          <span className="text-3xl">🎊</span>
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-bold">Vi har fått ny nettside!</p>
            <p>
              <Link className="underline hover:no-underline" href="/tilbakemelding">
                Gjerne gi oss tilbakemeldinger på den nye nettsiden her.
              </Link>
            </p>
          </div>
          <span className="text-3xl">🎊</span>
        </div>
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
              <Link
                className="font-semibold underline underline-offset-2 hover:text-primary"
                href="/om/echo"
              >
                her.
              </Link>
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
