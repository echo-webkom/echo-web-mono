"use client";

import { User, type Invitation } from "@echo-webkom/db/schemas";
import { Button } from "./ui/button";

type UserInvitationProp = {
  user: User;
  invitations: any[];
};

export const UserInvitations = (props: UserInvitationProp) => {
  return (
    <div>
      <h2>Invitations</h2>
      <ul>
        {props.invitations.map((invitation) => {
        return (
        <li>
          <div>
            <p>
            {invitation.happening.title}
            </p>
            <Button>Godta</Button>
            <Button>Avslå</Button>
          </div>
        </li>
        )})};
      </ul>
    </div>
  );
};
