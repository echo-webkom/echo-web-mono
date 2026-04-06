"use client";

import { useMemo, useState } from "react";

import { Text } from "@/components/typography/text";
import { Input } from "@/components/ui/input";

import { type UnoReturnType } from "../../../../../api/uno/client";
import { StrikeRow } from "./strike-row";

type Users = UnoReturnType["users"]["withStrikes"];

type StrikesListProps = {
  users: Users;
};

export const StrikesList = ({ users }: StrikesListProps) => {
  const [search, setSearch] = useState("");

  const usersWithDetails = useMemo(() => {
    return users
      .filter((user) => user.banInfo !== null || user.dots.length > 0)
      .map((user) => {
        const strikesCount = user.dots.reduce((total, dot) => total + dot.count, 0);

        return {
          id: user.id,
          name: user.name,
          isBanned: user.banInfo !== null,
          strikesCount,
          banInfo: user.banInfo,
          dots: user.dots,
        };
      })
      .sort((a, b) => {
        if (a.isBanned !== b.isBanned) {
          return a.isBanned ? -1 : 1;
        }

        if (a.strikesCount !== b.strikesCount) {
          return b.strikesCount - a.strikesCount;
        }

        return (a.name ?? "").localeCompare(b.name ?? "", "nb");
      });
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return usersWithDetails.filter((user) => {
      return (user.name ?? "").toLowerCase().includes(normalizedSearch);
    });
  }, [search, usersWithDetails]);

  if (!usersWithDetails.length) {
    return <Text>Ingen brukere har prikker eller ban.</Text>;
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
                strikeCount={user.strikesCount}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};
