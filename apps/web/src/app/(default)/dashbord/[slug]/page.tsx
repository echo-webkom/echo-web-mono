import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { Container } from "@/components/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isHost } from "@/lib/memberships";
import { getRegistrations } from "./_lib/get-registrations";
import { createBackLink } from "./_lib/utils";
import { AttendanceTab } from "./_tabs/attendance";
import { RegistrationsTab } from "./_tabs/registrations";
import { StatisticsTab } from "./_tabs/statistics";
import { UtilitiesTab } from "./_tabs/utilities";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventDashboard(props: Props) {
  const params = await props.params;
  const { slug } = params;
  const happening = await unoWithAdmin.happenings.full(slug);
  if (!happening) {
    return notFound();
  }

  const user = await auth();
  const hostGroups = happening.groups;
  const isHosting = user ? isHost(user, hostGroups) : false;
  if (!isHosting) {
    return notFound();
  }

  const registrations = await getRegistrations(happening.id);

  if (registrations.length < 1) {
    return (
      <Container layout="larger" className="flex flex-col gap-10 py-10">
        <div className="mx-auto mt-8 flex w-fit flex-col gap-8 p-5">
          <BackButton link={createBackLink(happening)} />
          <h3 className="text-center text-xl font-medium">Ingen registrerte!</h3>
          <Image
            className="rounded-lg"
            src="/gif/empty-shelves-john-travolta.gif"
            alt="Travolta looking around in an empty store"
            width={600}
            height={600}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container layout="larger" className="flex flex-col gap-10 py-10">
      <BackButton link={createBackLink(happening)} />

      <Tabs defaultValue="registrations">
        <TabsList className="grid h-10 w-full grid-cols-4">
          <TabsTrigger value="registrations">Påmeldinger</TabsTrigger>
          <TabsTrigger value="statistics">Statistikk</TabsTrigger>
          <TabsTrigger value="utilities">Verktøy</TabsTrigger>
          <TabsTrigger value="Attendance">Ta oppmøte</TabsTrigger>
        </TabsList>
        <TabsContent value="registrations">
          <RegistrationsTab happening={happening} registrations={registrations} />
        </TabsContent>
        <TabsContent value="statistics">
          <StatisticsTab happening={happening} registrations={registrations} />
        </TabsContent>
        <TabsContent value="utilities">
          <UtilitiesTab happening={happening} registrations={registrations} />
        </TabsContent>
        <TabsContent value="Attendance">
          <AttendanceTab happening={happening} registrations={registrations} />
        </TabsContent>
      </Tabs>
    </Container>
  );
}

const BackButton = ({ link }: { link: string }) => (
  <Link className="text-muted-foreground hover:underline" href={link}>
    <LuArrowLeft className="mr-2 inline-block" />
    <span>Tilbake til arrangementet</span>
  </Link>
);
