"use client";


import { Group, Happening, User, UsersToGroups } from "@echo-webkom/db/schemas";

import NotificationForm from "./notification-form";

type NotificationPageProps = {
  user: User & {
    memberships: Array<
      UsersToGroups & {
        group: Group;
      }
    >;
  };
  happenings: Happening[];
};

export default function NotificationPage({ user, happenings }: NotificationPageProps) {
  return (
    <div>
      <NotificationForm />
    </div>
  );
}
