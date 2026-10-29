import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { unoWithAdmin } from "@/api/server";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { createHappeningLink } from "@/lib/create-link";
import { ensureAnonymous } from "@/lib/ensure";

import { Banner } from "./hjem/_components/banner";
import { BentoBox } from "./hjem/_components/bento-box";

export default async function HomePage() {
  await ensureAnonymous({
    redirectTo: "/hjem",
  });

  const [bedpresses, events, banner] = await Promise.all([
    unoWithAdmin.sanity.happenings.home({ types: ["bedpres"], n: 4 }).catch(() => []),
    unoWithAdmin.sanity.happenings.home({ types: ["event", "external"], n: 4 }).catch(() => []),
    unoWithAdmin.sanity.banner().catch(() => null),
  ]);

  const studieretninger: Record<string, Record<string, string>> = {
    Bachelor: {
      Datateknologi: "https://www4.uib.no/studier/program/informatikk-datateknologi-bachelor",
      Datasikkerhet: "https://www4.uib.no/studier/program/informatikk-datasikkerhet-bachelor",
      "Informatikk-matematikk-økonomi":
        "https://www4.uib.no/studier/program/informatikk-matematikk-okonomi-bachelor",
      Bioinformatikk: "https://www4.uib.no/studier/program/informatikk-bioinformatikk-bachelor",
    },
    Master: {
      Informatikk: "https://www4.uib.no/studier/program/informatikk-master",
      Programvareutvikling:
        "https://www4.uib.no/studier/program/felles-masterprogram-i-programvareutvikling-master",
      "Data Science":
        "https://www4.uib.no/studier/program/data-science-integrert-masterprogram-sivilingenior",
    },
    Årsstudium: { Informatikk: "https://www4.uib.no/studier/program/informatikk-arsstudium" },
  };

  const allPrograms = Object.entries(studieretninger).flatMap(([degree, programs]) =>
    Object.entries(programs).map(([name, url]) => ({ degree, name, url })),
  );

  return (
    <>
      <div className="z-10">
        <Banner banner={banner} />
      </div>

      <div className="relative overflow-hidden">
        {/* <ParticlesBackdrop /> */}

        <Container layout="larger">
          <div className="space-y-12 py-10 md:space-y-16 md:py-16">
            <section className="max-w-3xl py-6 md:py-12">
              <h1 className="font-mono text-5xl font-semibold tracking-tight sm:text-7xl">echo</h1>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Linjeforeningen for informatikk
              </h2>
              <Reveal>
                <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 font-medium md:text-xl">
                  Vi jobber for å gjøre studiehverdagen for informatikkstudenter bedre gjennom
                  sosiale og faglige arrangementer.
                </p>
              </Reveal>
              <Reveal>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="secondary" size="default" asChild>
                    <Link href="/auth/logg-inn">Logg inn</Link>
                  </Button>
                  <Button variant="outline" size="default" asChild>
                    <Link href="/om/echo">Les mer om echo</Link>
                  </Button>
                </div>
              </Reveal>
            </section>

            <div className="grid gap-8 md:grid-cols-2">
              <Reveal translateX={-200}>
                <section className="h-full max-w-xl">
                  <h2 className="mb-4 text-2xl font-semibold">Hva er echo?</h2>
                  <p>
                    echo består av frivillige informatikkstudenter, og er delt inn i et hovedstyre
                    og en rekke undergrupper, komiteer og interesseorganisasjoner. Hovedstyret vårt
                    består av sju demokratisk valgte studenter og syv representanter fra
                    undergruppere. Vi er linjeforeningen for informatikk ved Universitetet i Bergen,
                    men har også et overordnet ansvar for studentsaker som angår det faglige ved
                    instituttet.
                  </p>
                </section>
              </Reveal>

              <Reveal translateX={200}>
                <section className="h-full max-w-xl">
                  <h2 className="mb-4 text-2xl font-semibold">For bedrifter</h2>
                  <p>
                    Vi tilbyr også muligheten for bedrifter til å presentere seg for
                    informatikkstudentene ved Universitetet i Bergen. Dette kan gjøres gjennom
                    bedriftspresentasjoner, workshops, kurs og andre arrangementer. Vi tilbyr også
                    muligheten for bedrifter å annonsere ledige stillinger og internship på
                    nettsiden vår.
                  </p>
                  <Link
                    className="text-primary mt-4 inline-block font-medium underline-offset-4 hover:underline"
                    href="/for-bedrifter/bedriftspresentasjon"
                  >
                    Les om bedriftspresentasjoner &rarr;
                  </Link>
                </section>
              </Reveal>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Reveal translateX={-200} delay={0.2}>
                <BentoBox title="Arrangementer" className="h-full">
                  {events.length > 0 ? (
                    <ul>
                      {events.map((event) => (
                        <li
                          key={event._id}
                          className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <Link
                            href={createHappeningLink(event)}
                            className="truncate font-medium underline-offset-4 hover:underline"
                          >
                            {event.title}
                          </Link>
                          <p className="text-muted-foreground text-nowrap">
                            {format(new Date(event.date), "EEE. dd.MM", {
                              locale: nb,
                            })}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Det er ingen kommende arrangementer</p>
                  )}
                </BentoBox>
              </Reveal>

              <Reveal translateX={200} delay={0.2}>
                <BentoBox title="Bedriftpresentasjoner" className="h-full">
                  {bedpresses.length > 0 ? (
                    <ul>
                      {bedpresses.map((bedpres) => (
                        <li
                          key={bedpres._id}
                          className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        >
                          <Link
                            href={createHappeningLink(bedpres)}
                            className="truncate font-medium underline-offset-4 hover:underline"
                          >
                            {bedpres.title}
                          </Link>
                          <p className="text-muted-foreground text-nowrap">
                            {format(new Date(bedpres.date), "EEE. dd.MM", {
                              locale: nb,
                            })}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Det er ingen kommende bedriftspresentasjoner</p>
                  )}
                </BentoBox>
              </Reveal>
            </div>

            <Reveal translateX={200}>
              <h1 className="mb-2 text-xl font-bold">Studieretninger</h1>
              <p className="mb-4">
                Alle som studerer informatikk ved UiB er automatisk med i echo.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allPrograms.map((p) => (
                  <Link
                    key={`${p.degree}-${p.name}`}
                    href={p.url}
                    className="group bg-card text-card-foreground hover:bg-muted/30 flex items-center justify-between rounded-lg border p-3 shadow-sm transition"
                  >
                    <div className="min-w-0">
                      <p className="truncate group-hover:underline">{p.name}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">{p.degree}</p>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}
