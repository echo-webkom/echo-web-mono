"use client";

import { useEffect, useState } from "react";

import { Group, Happening, User, UsersToGroups } from "@echo-webkom/db/schemas";

import { getHappeningsForGroup } from "@/lib/notification-helpers";
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
  console.log("Happenings: ", happenings);
  return (
    <div>
      <h1>Happenings</h1>
      {/* {happenings.length === 0 ? (
        <p>No happenings found.</p>
      ) : (
        <ul>
          {happenings.map((happening) => (
            <li key={happening.id}>
              <strong>{happening.title}</strong> ({happening.slug})
            </li>
          ))}
        </ul>
      )} */}
      <NotificationForm />
    </div>
  );
}
