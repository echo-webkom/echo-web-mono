"use server";

import { z } from "zod";

import { insertDegreeSchema, selectDegreeSchema } from "@echo-webkom/db/schemas";

import { createDegree, deleteDegree, updateDegree } from "@/data/degrees/mutations";
import { groupActionClient } from "@/lib/safe-action";

export const addDegreeAction = groupActionClient(["webkom", "hovedstyret"])
  .metadata({ actionName: "addDegree" })
  .schema(insertDegreeSchema)
  .action(async ({ parsedInput }) => {
    await createDegree(parsedInput);

    return {
      success: true,
      message: "Studieretningen ble lagt til",
    };
  });

export const removeDegreeAction = groupActionClient(["webkom", "hovedstyret"])
  .metadata({ actionName: "removeDegree" })
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    const id = parsedInput;

    await deleteDegree(id);

    return {
      success: true,
      message: "Studieretningen ble slettet",
    };
  });

export const editDegreeAction = groupActionClient(["webkom", "hovedstyret"])
  .metadata({ actionName: "editDegree" })
  .schema(selectDegreeSchema)
  .action(async ({ parsedInput }) => {
    await updateDegree(parsedInput);

    return {
      success: true,
      message: "Studieretningen ble oppdatert",
    };
  });
