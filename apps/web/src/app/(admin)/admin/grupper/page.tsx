// Ana ikkje kaf
import { db } from "@echo-webkom/db";
import { useState, useEffect } from "react";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import type { Group, GroupInsert } from "@echo-webkom/db/schemas";

export default function AdminGroupsPage() {
  const [groupList, setGroupList] = useState<Array<Group>>([]);

  useEffect(() => {
    async function fetchData() {
      await fetchGroups();
    }
    fetchData();
  }, []);

  const fetchGroups = async () => {
    const fetchedGroups = await db.query.groups.findMany({
      with: {
        members: {
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
        leaderUser: {
          columns: {
            name: true,
          },
        },
      },
    });
    setGroupList(fetchedGroups);
  };

  const createGroup = async (groupData: GroupInsert) => {
    const newGroup = await (db.query.groups.create({
      data: groupData,
    }) as Promise<Group>);
    setGroupList([...groupList, newGroup]);
  };

  const updateGroup = async (groupId: string, groupData: Partial<Group>) => {
    const updatedGroup = await (db.query.groups.update({
      where: {
        id: groupId,
      },
      data: groupData,
    }) as Promise<Group>);
    setGroupList(groupList.map((group) => (group.id === groupId ? updatedGroup : group)));
  };

  const deleteGroup = async (groupId: string) => {
    await (db.query.groups.delete({
      where: {
        id: groupId,
      },
    }) as Promise<void>);
    setGroupList(groupList.filter((group) => group.id !== groupId));
  };

  return (
    <Container>
      <Heading>Grupper</Heading>

      {/* Render group list */}
      {groupList.map((group: Group) => (
        <div key={group.id}>
          <p>{group.name}</p>
          <p>Leader: {group.leaderUser?.name ?? "Ingen"}</p>
          <p>Members: {group.members?.map((member: any) => member.user.name).join(", ")}</p>
          {/* Add update and delete buttons */}
          <button onClick={async () => await updateGroup(group.id, { name: "Updated Group Name" })}>
            Update
          </button>
          <button onClick={async () => await deleteGroup(group.id)}>Delete</button>
        </div>
      ))}

      {/* Add create group form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const groupData: GroupInsert = {
            name: formData.get("name") as string,
            // Add other group properties here
          };
          await createGroup(groupData);
        }}
      >
        <input type="text" name="name" placeholder="Group Name" />
        {/* Add other input fields for group properties */}
        <button type="submit">Create Group</button>
      </form>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle grupper og medlemmer.</p>

        <p>
          Denne siden kan brukes til debugging om noen sier at de ikke er medlem av en gruppe. Man
          også bruke denne siden til å debugge {"id"} på en gruppe. For at en undergruppe skal kunne
          se de som er påmeldt på arrangmentet sitt, så må {"id"} i databasen matche {"slug"} i
          Sanity på undergruppen.
        </p>

        <p>
          <i>(Ikke implementert enda)</i> Det er tenkt at en leder av en gruppe skal ha muligheten
          til å legge til nye personer i de gruppene personen er leder av.
        </p>
      </div>

      <code className="rounded-md bg-slate-100 p-2 font-mono">
        <pre>{JSON.stringify(g, null, 2)}</pre>
      </code>

    </Container>
  );
}
