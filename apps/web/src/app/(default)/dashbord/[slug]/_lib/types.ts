import {
  type Answer,
  type Group,
  type Question,
  type Registration,
  type User,
} from "@echo-webkom/db/schemas";

type Membership = {
  group: Group | null;
};

export type RegistrationWithUser = Omit<Registration, "userId"> & {
  user: User & {
    memberships: Array<Membership>;
  };
  changedByUser: User | null;
  answers?: Array<
    Answer & {
      question: Question;
    }
  >;
};
