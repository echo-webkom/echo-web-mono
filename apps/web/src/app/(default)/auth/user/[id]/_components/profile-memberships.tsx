import Link from "next/link";

import { Chip } from "@/components/typography/chip";
import { Text } from "@/components/typography/text";

import type { User } from "../../../../../../api/uno/client";

type ProfileMembershipsProps = {
  groups: User["groups"];
  variant: "card" | "profile";
};

export function ProfileMemberships({ groups, variant }: ProfileMembershipsProps) {
  if (groups.length === 0) {
    return null;
  }

  if (variant === "card") {
    return (
      <div>
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.id}>
              <Link href={`/gruppe/${group.id}`}>
                <Chip variant="secondary" className="hover:underline">
                  {group.name}
                </Chip>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <Text className="mb-1 font-semibold" size="lg">
        {groups.length === 1 ? "Undergruppe" : "Undergrupper"}
      </Text>
      <ul className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/gruppe/${group.id}`}>
              <Chip variant="outlined" className="hover:underline">
                {group.name}
              </Chip>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
