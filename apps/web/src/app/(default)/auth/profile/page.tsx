import Link from "next/link";
import {redirect} from "next/navigation";

import {prisma} from "@echo-webkom/db/client";
import {type HappeningType} from "@echo-webkom/db/types";

import Container from "@/components/container";
import SignOutButton from "@/components/sign-out-button";
import Heading from "@/components/ui/heading";
import UserForm from "@/components/user-form";
import {getServerSession} from "@/lib/session";

const happeningTypeToPath: Record<HappeningType, string> = {
  BEDPRES: "/bedpres",
  EVENT: "/event",
};

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  const happenings = await prisma.happening.findMany({
    where: {
      registrations: {
        some: {
          userId: session?.user.id,
        },
      },
    },
    include: {
      registrations: {
        where: {
          userId: session?.user.id,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <Container className="max-w-2xl gap-10">
      <Heading>Din profil</Heading>

      <div className="flex flex-col gap-3">
        <div>
          <p className="font-semibold">Navn:</p>
          <p>{session?.user.name}</p>
        </div>
        <div>
          <p className="font-semibold">E-post:</p>
          <p>{session?.user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-2xl font-bold">Påmeldte arrangementer</h2>
        {happenings.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {happenings.map((happening) => (
              <li key={happening.slug}>
                <Link
                  href={happeningTypeToPath[happening.type] + "/" + happening.slug}
                  className="text-lg font-semibold hover:underline"
                >
                  {happening.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du er ikke påmeldt noen arrangementer.</p>
        )}
      </div>

      <div>
        <UserForm
          alternativeEmail={session.user.alternativeEmail ?? undefined}
          degree={session.user.degree ?? undefined}
          year={session.user.year ?? undefined}
          id={session.user.id}
        />
      </div>

      <div className="mx-auto w-fit">
        <SignOutButton />
      </div>
    </Container>
  );
}
