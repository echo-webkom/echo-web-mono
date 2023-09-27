import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";

import { prisma } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { DeregisterButton } from "@/components/deregister-button";
import { Markdown } from "@/components/markdown";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { isEventOrganizer } from "@/lib/happening";
import { getHappeningBySlug } from "@/lib/queries/happening";
import { getUser } from "@/lib/session";
import { fetchBedpresBySlug } from "@/sanity/bedpres";
import { urlFor } from "@/utils/image-builder";

type Props = {
  params: {
    slug: string;
  };
};

export async function getData(slug: string) {
  const data = await getHappeningBySlug(slug);
  const info = await fetchBedpresBySlug(slug);

  if (!data || !info) {
    return notFound();
  }

  return {
    data,
    info,
  };
}

export const generateMetadata = async ({ params }: Props) => {
  const bedpres = await fetchBedpresBySlug(params.slug);

  return {
    title: bedpres.title,
  };
};

export default async function BedpresPage({ params }: Props) {
  const { slug } = params;

  // RENAME VARIABLES
  const { data: eventInfo, info: bedpres } = await getData(slug);

  const user = await getUser();

  const isOrganizer = user && isEventOrganizer(user, eventInfo);
  const isAdmin = user?.role === "ADMIN";

  const spotRange = await prisma.spotRange.findMany({
    where: {
      happeningSlug: slug,
    },
  });

  const isRegistered = user
    ? (
        await prisma.registration.findUnique({
          where: {
            userId_happeningSlug: {
              happeningSlug: slug,
              userId: user.id,
            },
          },
        })
      )?.status === "REGISTERED"
    : false;

  const registrations = await prisma.registration.findMany({
    where: {
      happeningSlug: slug,
    },
  });

  const registeredCount = registrations.filter(
    (registration) => registration.status === "REGISTERED",
  ).length;
  const waitlistCount = registrations.filter(
    (registration) => registration.status === "WAITLISTED",
  ).length;

  const maxCapacity = (
    await prisma.spotRange.findMany({
      where: {
        happeningSlug: slug,
      },
    })
  ).reduce((acc, curr) => acc + curr.spots, 0);

  const isRegistrationOpen =
    eventInfo?.registrationStart &&
    eventInfo?.registrationEnd &&
    isAfter(new Date(), eventInfo.registrationStart) &&
    isBefore(new Date(), eventInfo.registrationEnd);

  return (
    <Container className="w-full md:max-w-[700px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        <Sidebar>
          <SidebarItem>
            <Link href={bedpres.company.website}>
              <div className="overflow-hidden">
                <div className="relative aspect-square w-full">
                  <Image
                    src={urlFor(bedpres.company.image).url()}
                    alt={`${bedpres.company.name} logo`}
                    fill
                  />
                </div>
              </div>
            </Link>
          </SidebarItem>

          <SidebarItem>
            <SidebarItemTitle>Bedrift:</SidebarItemTitle>
            <SidebarItemContent>
              <Link className="hover:underline" href={bedpres.company.website}>
                {bedpres.company.name}
                <ExternalLinkIcon className="ml-1 inline-block h-4 w-4" />
              </Link>
            </SidebarItemContent>
          </SidebarItem>

          {eventInfo.date && (
            <SidebarItem>
              <SidebarItemTitle>Dato:</SidebarItemTitle>
              <SidebarItemContent>{eventInfo?.date.toLocaleDateString("nb-NO")}</SidebarItemContent>
            </SidebarItem>
          )}

          {eventInfo.date && (
            <SidebarItem>
              <SidebarItemTitle>Tid:</SidebarItemTitle>
              <SidebarItemContent>
                {eventInfo?.date.toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {spotRange.length > 0 && (
            <SidebarItem>
              <SidebarItemTitle>Plasser:</SidebarItemTitle>
              {spotRange.map((range) => (
                <SidebarItemContent key={range.id}>
                  {range.spots} plasser for
                  {range.minDegreeYear === range.maxDegreeYear ? (
                    <span> {range.minDegreeYear}. trinn</span>
                  ) : (
                    <span>
                      {" "}
                      {range.minDegreeYear} - {range.maxDegreeYear}. trinn
                    </span>
                  )}
                </SidebarItemContent>
              ))}
            </SidebarItem>
          )}

          {bedpres.location && (
            <SidebarItem>
              <SidebarItemTitle>Sted:</SidebarItemTitle>
              <SidebarItemContent>{bedpres.location.name}</SidebarItemContent>
            </SidebarItem>
          )}

          {bedpres.contacts && bedpres.contacts.length > 0 && (
            <SidebarItem>
              <SidebarItemTitle>Kontaktpersoner:</SidebarItemTitle>
              <SidebarItemContent>
                <ul>
                  {bedpres.contacts.map((contact) => (
                    <li key={contact.profile._id}>
                      <a className="hover:underline" href={"mailto:" + contact.email}>
                        {contact.profile.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </SidebarItemContent>
            </SidebarItem>
          )}

          {eventInfo.registrationStart && isAfter(new Date(), eventInfo.registrationStart) && (
            <SidebarItem>
              <SidebarItemTitle>Påmeldte:</SidebarItemTitle>
              <SidebarItemContent>
                {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {eventInfo.registrationStart &&
            eventInfo.registrationStart < new Date() &&
            waitlistCount > 0 && (
              <SidebarItem>
                <SidebarItemTitle>Venteliste:</SidebarItemTitle>
                <SidebarItemContent>{waitlistCount}</SidebarItemContent>
              </SidebarItem>
            )}

          {isRegistrationOpen && eventInfo.registrationEnd && (
            <SidebarItem>
              <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
              <SidebarItemContent>
                {eventInfo?.registrationEnd.toLocaleDateString("nb-NO")}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {!isRegistrationOpen &&
            eventInfo?.registrationStart &&
            new Date() < eventInfo.registrationStart && (
              <SidebarItem>
                <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
                <SidebarItemContent>
                  {eventInfo?.registrationStart.toLocaleDateString("nb-NO")}
                </SidebarItemContent>
              </SidebarItem>
            )}

          {user && isRegistrationOpen && (
            <SidebarItem>
              {isRegistered ? (
                <DeregisterButton slug={params.slug} />
              ) : (
                <RegisterButton slug={params.slug} questions={eventInfo.questions} />
              )}
            </SidebarItem>
          )}

          {user && !isRegistrationOpen && (
            <SidebarItem>
              <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
                <p className="font-semibold">Påmelding er stengt.</p>
              </div>
            </SidebarItem>
          )}

          {!user && (
            <SidebarItem>
              <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
                <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
                <div className="flex items-center">
                  <Link href="/api/auth/logg-inn" className="hover:underline">
                    Logg inn her
                  </Link>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              </div>
            </SidebarItem>
          )}

          {(isAdmin || isOrganizer) && (
            <SidebarItem>
              <Button fullWidth variant="link" asChild>
                <Link href={"/dashbord/" + slug}>Til Dashboard</Link>
              </Button>
            </SidebarItem>
          )}
        </Sidebar>

        {/* Content */}
        <article className="w-full">
          <Heading>{bedpres.title}</Heading>
          {bedpres.body ? (
            <Markdown content={bedpres.body} />
          ) : (
            <div className="mx-auto flex w-fit flex-col gap-8 p-5">
              <h3 className="text-center text-xl font-medium">Mer informasjon kommer!</h3>
              <Image
                className="rounded-lg"
                src="/gif/wallace-construction.gif"
                alt="Wallace hammering"
                width={400}
                height={400}
              />
            </div>
          )}
        </article>
      </div>

      <div className="flex flex-col gap-3 pt-10 text-center text-sm text-muted-foreground lg:mt-auto">
        <p>Publisert: {new Date(bedpres._createdAt).toLocaleDateString()}</p>
        <p>Sist oppdatert: {new Date(bedpres._updatedAt).toLocaleDateString()}</p>
      </div>
    </Container>
  );
}
