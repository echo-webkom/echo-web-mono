"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { usersToGroups } from "@echo-webkom/db/schemas";

import { getUser } from "@/lib/get-user";

/**
 * Makes a user leader of a group. This should only be done if the user is member
 * of the group, and the user that made the request is also a leader.
 *
 * @param groupId the id of the group that the user should be made leader of
 * @param userId the id of the user that should be made leader of the group
 * @returns
 */
export async function setGroupLeader(groupId: string, userId: string, leader: boolean) {
  try {
    const group = await db.query.groups.findFirst({
      where: (group) => eq(group.id, groupId),
      with: {
        members: true,
      },
    });

    if (!group) {
      return {
        success: false,
        message: "Gruppe finnes ikke",
      };
    }

    const isUserInGroup = group.members.find((member) => member.userId === userId);

    if (!isUserInGroup) {
      return {
        success: false,
        message: "Bruker er ikke medlem av gruppen",
      };
    }

    const requestUser = await getUser();

    if (!requestUser) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isRequestUserLeader = group.members.find(
      (member) => member.isLeader && member.userId === requestUser?.id,
    );

    if (!isRequestUserLeader) {
      return {
        success: false,
        message: "Du er ikke leder av gruppen",
      };
    }

    const isUserAlreadyLeader = group.members.find(
      (member) => member.isLeader && member.userId === userId,
    );

    await db
      .update(usersToGroups)
      .set({
        isLeader: leader,
      })
      .where(and(eq(usersToGroups.userId, userId), eq(usersToGroups.groupId, groupId)));

    return {
      success: true,
      message: isUserAlreadyLeader
        ? "Bruker er ikke lenger leder av gruppen"
        : "Bruker er nå leder av gruppen",
    };
  } catch {
    return {
      success: false,
      message: "Kunne ikke gjøre bruker leder",
    };
  }
}

/**
 * Removes a user from a group. This should only be done if the user that made
 * the request is a leader of the group, and the user is not a leader of the group.
 *
 * @param userId the user to be removed
 * @param groupId the group to remove the user from
 */
export async function removeFromGroup(userId: string, groupId: string) {
  try {
    const group = await db.query.groups.findFirst({
      where: (group) => eq(group.id, groupId),
      with: {
        members: true,
      },
    });

    if (!group) {
      return {
        success: false,
        message: "Gruppe finnes ikke",
      };
    }

    const isUserInGroup = group.members.find((member) => member.userId === userId);

    if (!isUserInGroup) {
      return {
        success: false,
        message: "Bruker er ikke medlem av gruppen",
      };
    }

    const requestUser = await getUser();

    if (!requestUser) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isRequestUserLeader = group.members.find(
      (member) => member.isLeader && member.userId === requestUser?.id,
    );

    if (!isRequestUserLeader) {
      return {
        success: false,
        message: "Du er ikke leder av gruppen",
      };
    }

    const isUserAlreadyLeader = group.members.find(
      (member) => member.isLeader && member.userId === userId,
    );

    if (isUserAlreadyLeader) {
      return {
        success: false,
        message: "Kan ikke fjerne. Bruker er leder av gruppen",
      };
    }

    await db
      .delete(usersToGroups)
      .where(and(eq(usersToGroups.userId, userId), eq(usersToGroups.groupId, groupId)));

    return {
      success: true,
      message: "Bruker ble fjernet fra gruppen",
    };
  } catch {
    return {
      success: false,
      message: "Kunne ikke fjerne bruker fra gruppen",
    };
  }
}

/**
 * Adds a user to a group. This should only be done if the user that made the
 * request is a leader of the group.
 *
 * @param userId the user to be added
 * @param groupId the group to add the user to
 */
export async function addUserToGroup(userEmail: string, groupId: string) {
  try {
    const group = await db.query.groups.findFirst({
      where: (group) => eq(group.id, groupId),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      return {
        success: false,
        message: "Gruppe finnes ikke",
      };
    }

    const isUserInGroup = group.members.find((member) => member.user.email === userEmail);

    if (isUserInGroup) {
      return {
        success: false,
        message: "Bruker er allerede medlem av gruppen",
      };
    }

    const requestUser = await getUser();

    if (!requestUser) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isRequestUserLeader = group.members.find(
      (member) => member.isLeader && member.userId === requestUser?.id,
    );

    if (!isRequestUserLeader) {
      return {
        success: false,
        message: "Du er ikke leder av gruppen",
      };
    }

    const user = await db.query.users.findFirst({
      where: (user) => eq(user.email, userEmail),
    });

    if (!user) {
      return {
        success: false,
        message: "Bruker finnes ikke",
      };
    }

    await db.insert(usersToGroups).values({
      userId: user.id,
      groupId,
    });

    return {
      success: true,
      message: "Bruker ble lagt til i gruppen",
    };
  } catch {
    return {
      success: false,
      message: "Kunne ikke legge til bruker i gruppen",
    };
  }
}
