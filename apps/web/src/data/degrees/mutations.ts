import { unoWithAdmin } from "@/api/server";
import { type Degree, type DegreeInsert } from "@/api/uno/client";

export const createDegree = async (newDegree: DegreeInsert) => {
  await unoWithAdmin.degrees.create(newDegree);
};

export const deleteDegree = async (id: string) => {
  await unoWithAdmin.degrees.delete(id);
};

export const updateDegree = async (updatedDegree: Degree) => {
  await unoWithAdmin.degrees.update(updatedDegree);
};
