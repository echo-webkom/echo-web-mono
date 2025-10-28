"use server";

import { z } from "zod";

import {
  insertDegreeSchema,
  selectDegreeSchema,
  type Degree,
  type DegreeInsert,
} from "@echo-webkom/db/schemas";

import { createDegree, deleteDegree, updateDegree } from "@/data/degrees/mutations";
import { checkAuthorization, handleActionError } from "@/utils/server-action-helpers";
import { isWebkom } from "@/lib/memberships";

export const addDegree = async (payload: DegreeInsert) => {
  const authError = await checkAuthorization({ requiredGroups: ["webkom", "hovedstyret"] });
  if (authError) return authError;

  try {
    const parsedPayload = insertDegreeSchema.parse(payload);

    await createDegree(parsedPayload);

    return {
      success: true,
      message: "Studieretningen ble lagt til",
    };
  } catch (error) {
    console.error(`[addDegree] Error: ${error} [payload: ${JSON.stringify(payload)}]`);
    return handleActionError(error);
  }
};

export const removeDegree = async (id: string) => {
  const authError = await checkAuthorization({ requiredGroups: ["webkom", "hovedstyret"] });
  if (authError) return authError;

  try {
    await deleteDegree(id);

    return {
      success: true,
      message: "Studieretningen ble slettet",
    };
  } catch (error) {
    console.error(`[deleteDegree] Error: ${error} [id: ${id}]`);
    return handleActionError(error);
  }
};

export const editDegree = async (payload: Degree) => {
  const authError = await checkAuthorization({ 
    customCheck: (user) => isWebkom(user) 
  });
  if (authError) return authError;

  try {
    const parsedPayload = selectDegreeSchema.parse(payload);

    await updateDegree(parsedPayload);

    return {
      success: true,
      message: "Studieretningen ble oppdatert",
    };
  } catch (error) {
    console.error(`[updateDegree] Error: ${error} [payload: ${JSON.stringify(payload)}]`);
    return handleActionError(error);
  }
};
