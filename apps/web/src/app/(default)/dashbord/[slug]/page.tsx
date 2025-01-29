import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

import { Container } from "@/components/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFullHappening } from "@/data/happenings/queries";
import { getUser } from "@/lib/get-user";
import { isHost } from "@/lib/memberships";
import { getRegistrations } from "./_lib/get-registrations";
import { createBackLink } from "./_lib/utils";
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
  const happening = await getFullHappening(slug);
  if (!happening) {
    return notFound();
  }

  const user = await getUser();
  const hostGroups = happening.groups.map((group) => group.groupId);
  const isHosting = user ? isHost(user, hostGroups) : false;
  if (!isHosting) {
    return notFound();
  }

  const registrations = await getRegistrations(happening.id);

  return (
    <Container layout="larger" className="flex flex-col gap-10 py-10">
      <BackButton link={createBackLink(happening)} />

      <Tabs defaultValue="registrations">
        <TabsList className="grid h-10 w-full grid-cols-3">
          <TabsTrigger value="registrations">Påmeldinger</TabsTrigger>
          <TabsTrigger value="statistics">Statistikk</TabsTrigger>
          <TabsTrigger value="utilities">Verktøy</TabsTrigger>
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
