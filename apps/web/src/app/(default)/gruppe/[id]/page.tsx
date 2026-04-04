import { notFound } from "next/navigation";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AddUserToGroupDialog } from "./_components/add-user-to-group-dialog";
import { GroupUserForm } from "./_components/group-user-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ManageGroup(props: Props) {
  const params = await props.params;
  const user = await auth();

  if (!user) {
    return (
      <div>
        <Heading className="text-center">Ikke logget inn</Heading>
      </div>
    );
  }

  const [groupResult, members] = await Promise.all([
    unoWithAdmin.groups.byId(params.id),
    unoWithAdmin.groups.members(params.id),
  ]);

  const group = groupResult;

  if (!group) {
    return notFound();
  }

  members.sort((a, b) => {
    if (!a.name || !b.name) {
      return -1;
    }

    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });

  const groupUserProfile = members.find((member) => member.id === user.id);

  if (!groupUserProfile) {
    return (
      <div>
        <Heading className="text-center">Ikke medlem av gruppen</Heading>
      </div>
    );
  }

  const isGroupAdmin = groupUserProfile.isLeader;

  return (
    <Container className="space-y-8 py-10">
      <Heading>Administrer {group.name}</Heading>

      <Text>
        Velkommen til siden for administrasjon av {group.name}. Her kan du se hvem som er medlemmer
        og ledere av gruppen. Om du er en leder kan du også legge til og fjerne medlemmer.
      </Text>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Heading level={3}>Medlemmer</Heading>

          {isGroupAdmin && <AddUserToGroupDialog group={group} />}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Navn</TableHead>
              <TableHead scope="col">E-post</TableHead>
              <TableHead scope="col">Leder</TableHead>
              {isGroupAdmin && <TableHead scope="col">Endre</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell className="p-4">{member.email}</TableCell>
                <TableCell className="p-4">{member.isLeader ? "Ja" : "Nei"}</TableCell>
                {isGroupAdmin && (
                  <TableCell className="p-4">
                    <GroupUserForm
                      user={{
                        email: member.email,
                        id: member.id,
                        name: member.name ?? member.email,
                      }}
                      group={group}
                      isLeader={member.isLeader}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
