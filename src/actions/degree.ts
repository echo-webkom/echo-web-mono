"use server";

import { z } from "zod";

import { createDegree, deleteDegree, updateDegree } from "@/data/degrees/mutations";
import { Degree, DegreeInsert, insertDegreeSchema, selectDegreeSchema } from "@/db/schemas";
import { getUser } from "@/lib/get-user";
import { isMemberOf, isWebkom } from "@/lib/memberships";

export const addDegree = async (payload: DegreeInsert) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (!isMemberOf(user, ["webkom", "hovedstyret"])) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

  try {
    const parsedPayload = insertDegreeSchema.parse(payload);

    await createDegree(parsedPayload);

    return {
      success: true,
      message: "Studieretningen ble lagt til",
    };
  } catch (error) {
    console.error(`[addDegree] Error: ${error} [payload: ${JSON.stringify(payload)}]`);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Feil i skjemaet",
      };
    }

    return {
      success: false,
      message: "En ukjent feil oppstod",
    };
  }
};

export const removeDegree = async (id: string) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (!isMemberOf(user, ["webkom", "hovedstyret"])) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

  try {
    await deleteDegree(id);

    return {
      success: true,
      message: "Studieretningen ble slettet",
    };
  } catch (error) {
    console.error(`[deleteDegree] Error: ${error} [id: ${id}]`);

    return {
      success: false,
      message: "En ukjent feil oppstod",
    };
  }
};

export const editDegree = async (payload: Degree) => {
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (!isWebkom(user)) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

  try {
    const parsedPayload = selectDegreeSchema.parse(payload);

    await updateDegree(parsedPayload);

    return {
      success: true,
      message: "Studieretningen ble oppdatert",
    };
  } catch (error) {
    console.error(`[updateDegree] Error: ${error} [payload: ${JSON.stringify(payload)}]`);

    return {
      success: false,
      message: "En ukjent feil oppstod",
    };
  }
};
