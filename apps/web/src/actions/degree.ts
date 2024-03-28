"use server";

import { z } from "zod";

import { insertDegreeSchema, selectDegreeSchema } from "@echo-webkom/db/schemas";

import { createDegree, deleteDegree, updateDegree } from "@/data/degrees/mutations";
import { webkomAction } from "@/lib/safe-actions";

export const addDegree = webkomAction.input(insertDegreeSchema).create(async ({ input }) => {
  await createDegree(input);

  return "Studieretningen ble lagt til";
});

export const removeDegree = webkomAction.input(z.string()).create(async ({ input }) => {
  await deleteDegree(input);

  return "Studieretningen ble slettet";
});

export const editDegree = webkomAction.input(selectDegreeSchema).create(async ({ input }) => {
  await updateDegree(input);

  return "Studieretningen ble oppdatert";
});
