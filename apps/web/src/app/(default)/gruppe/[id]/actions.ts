"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

export const setGroupLeader = async (groupId: string, userId: string, leader: boolean) => {
  try {
    const members = await unoWithAdmin.groups.members(groupId);

    const isUserInGroup = members.find((member) => member.id === userId);
    if (!isUserInGroup) {
      return {
        success: false,
        message: "Bruker er ikke medlem av gruppen",
      };
    }

    const requestUser = await auth();
    if (!requestUser) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isRequestUserLeader = members.find(
      (member) => member.isLeader && member.id === requestUser.id,
    );
    if (!isRequestUserLeader) {
      return {
        success: false,
        message: "Du er ikke leder av gruppen",
      };
    }

    const isUserAlreadyLeader = members.find((member) => member.isLeader && member.id === userId);

    const ok = await unoWithAdmin.groups.setLeader(groupId, userId, leader);
    if (!ok) {
      return {
        success: false,
        message: "Kunne ikke gjøre bruker leder",
      };
    }

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
};

export const removeFromGroup = async (userId: string, groupId: string) => {
  try {
    const members = await unoWithAdmin.groups.members(groupId);

    const isUserInGroup = members.find((member) => member.id === userId);
    if (!isUserInGroup) {
      return {
        success: false,
        message: "Bruker er ikke medlem av gruppen",
      };
    }

    const requestUser = await auth();
    if (!requestUser) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isRequestUserLeader = members.find(
      (member) => member.isLeader && member.id === requestUser.id,
    );
    if (!isRequestUserLeader) {
      return {
        success: false,
        message: "Du er ikke leder av gruppen",
      };
    }

    const isUserAlreadyLeader = members.find((member) => member.isLeader && member.id === userId);
    if (isUserAlreadyLeader) {
      return {
        success: false,
        message: "Kan ikke fjerne. Bruker er leder av gruppen",
      };
    }

    const ok = await unoWithAdmin.groups.removeUser(groupId, userId);
    if (!ok) {
      return {
        success: false,
        message: "Kunne ikke fjerne bruker fra gruppen",
      };
    }

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
};

export const addUserToGroup = async (userId: string, groupId: string) => {
  try {
    const members = await unoWithAdmin.groups.members(groupId);

    const isUserInGroup = members.find((member) => member.id === userId);
    if (isUserInGroup) {
      return {
        success: false,
        message: "Bruker er allerede medlem av gruppen",
      };
    }

    const requestUser = await auth();
    if (!requestUser) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isRequestUserLeader = members.find(
      (member) => member.isLeader && member.id === requestUser.id,
    );
    if (!isRequestUserLeader) {
      return {
        success: false,
        message: "Du er ikke leder av gruppen",
      };
    }

    const ok = await unoWithAdmin.groups.addUser(groupId, userId);
    if (!ok) {
      return {
        success: false,
        message: "Kunne ikke legge til bruker i gruppen",
      };
    }

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
};
