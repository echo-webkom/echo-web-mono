import { type Group, type Registration, type User } from "@/db/schemas";

type Membership = {
  group: Group | null;
};

export type RegistrationWithUser = Omit<Registration, "userId"> & {
  user: User & {
    memberships: Array<Membership>;
  };
  changedByUser: User | null;
};
