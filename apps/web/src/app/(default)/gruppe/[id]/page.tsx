import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { AddUserToGroupDialog } from "./_components/add-user-to-group-dialog";
import { GroupUserForm } from "./_components/group-user-form";

type Props = {
  params: {
    id: string;
  };
};

export default async function ManageGroup({ params }: Props) {
  const user = await auth();

  if (!user) {
    return (
      <div>
        <Heading className="text-center">Ikke logget inn</Heading>
      </div>
    );
  }

  const group = await db.query.groups.findFirst({
    where: (group) => eq(group.id, params.id),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!group) {
    return notFound();
  }

  group.members.sort((a, b) => {
    if (!a.user.name || !b.user.name) {
      return -1;
    }

    if (a.user.name < b.user.name) {
      return -1;
    }

    if (a.user.name > b.user.name) {
      return 1;
    }

    return 0;
  });

  const groupUserProfile = group.members.find((member) => member.user.id === user.id);

  if (!groupUserProfile) {
    return (
      <div>
        <Heading className="text-center">Ikke medlem av gruppen</Heading>
      </div>
    );
  }

  const isGroupAdmin = groupUserProfile.isLeader;

  return (
    <Container className="space-y-8">
      <Heading>Administrer {group.name}</Heading>

      <Text>
        Velkommen til siden for administrasjon av {group.name}. Her kan du se hvem som er medlemmer
        og ledere av gruppen. Om du er en leder kan du også legge til og fjerne medlemmer.
      </Text>

      <div className="space-y-2">
        <Heading level={3}>Generell informasjon</Heading>
        <p>
          <span className="font-medium">Database ID:</span> {group.id}
        </p>
        <p>
          <span className="font-medium">Navn:</span> {group.name}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Heading level={3}>Medlemmer</Heading>

          {isGroupAdmin && <AddUserToGroupDialog group={group} />}
        </div>

        <div className="relative overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[700px]">
            <thead className="bg-muted text-muted-foreground">
              <tr className="p-4 text-left">
                <th scope="col" className="p-4">
                  Navn
                </th>
                <th scope="col" className="p-4">
                  E-post
                </th>
                <th scope="col" className="p-4">
                  Leder
                </th>
                {isGroupAdmin && (
                  <th scope="col" className="p-4">
                    Endre
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {group.members.map((member) => (
                <tr key={member.userId}>
                  <th scope="row" className="p-4 text-left font-medium">
                    {member.user.name}
                  </th>
                  <td className="p-4">{member.user.email}</td>
                  <td className="p-4">{member.isLeader ? "Ja" : "Nei"}</td>
                  {isGroupAdmin && (
                    <td className="p-4">
                      <GroupUserForm
                        user={{
                          email: member.user.email,
                          id: member.userId,
                          name: member.user.name ?? member.userId,
                        }}
                        group={group}
                        isLeader={member.isLeader}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
