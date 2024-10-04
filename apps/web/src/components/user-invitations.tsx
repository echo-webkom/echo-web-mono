"use client";

import { User, type Invitation } from "@echo-webkom/db/schemas";

import { Happening } from "@/sanity.types";
import { Button } from "./ui/button";

type UserInvitationProp = {
  user: User;
  invitations: Array<
    Invitation & {
      happening: Happening;
    }
  >;
};

export const UserInvitations = ({ user, invitations }: UserInvitationProp) => {
  return (
    <div>
      <h2>Invitations</h2>
      <ul>
        {invitations.map((invitation) => {
          return (
            <li>
              <div>
                <p>{invitation.happening.title}</p>
                <p>{invitation.expiresAt.toString()}</p>
                <Button>Godta</Button>
                <Button>Avslå</Button>
              </div>
            </li>
          );
        })}
        ;
      </ul>
    </div>
  );
};
