"use client";

import { Group, User, UsersToGroups } from "@echo-webkom/db/schemas";

import NotificationForm from "./notification-form";

type NotificationPageProps = {
  user: User & {
    memberships: Array<
      UsersToGroups & {
        group: Group;
      }
    >;
  };
};

export default function NotificationPage({ user }: NotificationPageProps) {
  return (
    <>
      <NotificationForm />
    </>
  );
}
