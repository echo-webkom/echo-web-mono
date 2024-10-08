import { type Degree, type DegreeInsert } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const createDegree = async (newDegree: DegreeInsert) => {
  await apiServer.post("degrees", {
    json: newDegree,
  });
};

export const deleteDegree = async (id: string) => {
  await apiServer.delete(`degree/${id}`);
};

export const updateDegree = async (updatedDegree: Degree) => {
  await apiServer.post(`degree/${updatedDegree.id}`, {
    json: updatedDegree,
  });
};
