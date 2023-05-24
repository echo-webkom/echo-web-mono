import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import {isAfter, isBefore} from "date-fns";

import {prisma} from "@echo-webkom/db/client";
import {getHappeningBySlug} from "@echo-webkom/db/queries/happening";
import {getUserById} from "@echo-webkom/db/queries/user";

import Container from "@/components/container";
import DeregisterButton from "@/components/deregister-button";
import Markdown from "@/components/markdown";
import RegisterButton from "@/components/register-button";
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {isEventOrganizer} from "@/lib/happening";
import {getServerSession} from "@/lib/session";
import {fetchBedpresBySlug} from "@/sanity/bedpres";
import {urlFor} from "@/utils/image-builder";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({params}: Props) {
  const bedpres = await fetchBedpresBySlug(params.slug);

  return {
    title: bedpres.title,
  };
}

export default async function BedpresPage({params}: Props) {
  const {slug} = params;

  const eventInfo = await getHappeningBySlug(slug);
  if (!eventInfo) {
    return notFound();
  }

  const session = await getServerSession();
  const bedpres = await fetchBedpresBySlug(slug);
  const user = await getUserById(session?.user.id ?? "");

  const isOrganizer = user && isEventOrganizer(eventInfo, user);
  const isAdmin = session?.user.role === "ADMIN";

  const spotRange = await prisma.spotRange.findMany({
    where: {
      happeningSlug: slug,
    },
  });

  let isRegistered: boolean;
  if (session) {
    const registration = await prisma.registration.findUnique({
      where: {
        userId_happeningSlug: {
          happeningSlug: slug,
          userId: session.user.id,
        },
      },
    });
    isRegistered = Boolean(registration?.status === "REGISTERED");
  } else {
    isRegistered = false;
  }

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
    eventInfo?.registrationStart && eventInfo.registrationStart < new Date();

  return (
    <Container className="w-full md:max-w-[700px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="flex h-full w-full flex-col gap-3 lg:max-w-[250px]">
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

          {eventInfo?.date && (
            <div>
              <p className="font-semibold">Dato:</p>
              <p>{eventInfo?.date.toLocaleDateString("nb-NO")}</p>
            </div>
          )}

          {eventInfo?.date && (
            <div>
              <p className="font-semibold">Tid:</p>
              <p>
                {eventInfo?.date.toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {spotRange.length > 0 && (
            <div>
              <p className="font-semibold">Plasser:</p>
              {spotRange.map((range) => (
                <p key={range.id}>
                  {range.spots} plasser for
                  {range.minDegreeYear === range.maxDegreeYear ? (
                    <span> {range.minDegreeYear}. trinn</span>
                  ) : (
                    <span>
                      {" "}
                      {range.minDegreeYear} - {range.maxDegreeYear}. trinn
                    </span>
                  )}
                </p>
              ))}
            </div>
          )}

          {bedpres.location && (
            <div>
              <p className="font-semibold">Sted:</p>
              <p>{bedpres.location.name}</p>
            </div>
          )}

          {bedpres.contacts && bedpres.contacts.length > 0 && (
            <div>
              <p className="font-semibold">Kontaktpersoner:</p>
              <ul>
                {bedpres.contacts.map((contact) => (
                  <li key={contact.profile._id}>
                    <a className="hover:underline" href={"mailto:" + contact.email}>
                      {contact.profile.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {eventInfo?.registrationStart && eventInfo.registrationStart < new Date() && (
            <div>
              <p className="font-semibold">Påmeldte:</p>
              <p>
                {registeredCount} / {maxCapacity}
              </p>
            </div>
          )}

          {eventInfo?.registrationStart &&
            eventInfo.registrationStart < new Date() &&
            waitlistCount > 0 && (
              <div>
                <p className="font-semibold">Venteliste:</p>
                <p>{waitlistCount}</p>
              </div>
            )}

          {isRegistrationOpen && eventInfo?.registrationEnd && (
            <div>
              <p className="font-semibold">Påmeldingsfrist:</p>
              <p>{eventInfo?.registrationEnd.toLocaleDateString("nb-NO")}</p>
            </div>
          )}

          {!isRegistrationOpen &&
            eventInfo?.registrationStart &&
            new Date() < eventInfo.registrationStart && (
              <div>
                <p className="font-semibold">Påmelding åpner:</p>
                <p>{eventInfo?.registrationStart.toLocaleDateString("nb-NO")}</p>
              </div>
            )}

          {session &&
            eventInfo?.registrationStart &&
            eventInfo?.registrationEnd &&
            isAfter(new Date(), eventInfo.registrationStart) &&
            isBefore(new Date(), eventInfo.registrationEnd) && (
              <div>
                {isRegistered ? (
                  <DeregisterButton slug={params.slug} />
                ) : (
                  <>
                    <RegisterButton slug={params.slug} questions={eventInfo.questions} />
                  </>
                )}
              </div>
            )}

          {!session && (
            // Create a warning box that is yellow
            <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
              <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
              <div className="flex items-center">
                <Link href="/api/auth/signin" className="hover:underline">
                  Logg inn her
                </Link>
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </div>
            </div>
          )}

          {(isAdmin || isOrganizer) && (
            <div>
              <Button fullWidth variant="link" asChild>
                <Link href={"/event/" + params.slug + "/dashboard"}>Til Dashboard</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <article>
          <Heading>{bedpres.title}</Heading>
          <Markdown content={bedpres.body ?? "## Mer informasjon kommer!"} />
        </article>
      </div>

      <div className="flex flex-col gap-3 pt-10 text-center text-sm text-muted-foreground lg:mt-auto">
        <p>Publisert: {new Date(bedpres._createdAt).toLocaleDateString()}</p>
        <p>Sist oppdatert: {new Date(bedpres._updatedAt).toLocaleDateString()}</p>
      </div>
    </Container>
  );
}
