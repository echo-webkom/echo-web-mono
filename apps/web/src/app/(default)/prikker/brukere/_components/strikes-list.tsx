"use client";

import { useMemo, useState } from "react";

import { Text } from "@/components/typography/text";
import { Input } from "@/components/ui/input";
import { type getBannedUsers } from "@/data/users/queries";
import { StrikeRow } from "./strike-row";

type Users = Awaited<ReturnType<typeof getBannedUsers>>;

type StrikesListProps = {
  users: Users;
};

export const StrikesList = ({ users }: StrikesListProps) => {
  const [search, setSearch] = useState("");
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return user.name?.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, users]);

  if (!users.length) {
    return <Text>Ingen brukere har prikker.</Text>;
  }

  return (
    <div>
      <Input
        type="search"
        placeholder="Søk etter bruker"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {filteredUsers.length === 0 && (
        <Text className="mb-4">Fant ingen brukere som matcher søket.</Text>
      )}

      {filteredUsers.length > 0 && (
        <ul className="flex flex-col divide-y">
          {filteredUsers.map((user) => {
            return (
              <StrikeRow
                key={user.id}
                userId={user.id}
                name={user.name ?? "Ingen navn"}
                banInfo={user.banInfo}
                strikes={user.dots}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};
