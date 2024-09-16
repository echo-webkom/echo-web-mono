import { selectUserSchema, type Question } from "@echo-webkom/db/schemas";

import { zodKeys } from "@/lib/zod-keys";

type HeaderType = "name" | "email" | "alternativeEmail" | "degreeId" | "year" | "status" ;

export const formatHeaders: Record<HeaderType, string> = {
  name: "Navn",
  email: "Epost",
  alternativeEmail: "Alternativ Epost",
  year: "År",
  degreeId: "Studieretning",
  status: "Status",
};

export const getColumns = (questions: Array<Question>) => {
  const columns = [...zodKeys(selectUserSchema)]
    .filter((key) => key in formatHeaders)
    .map((key) => formatHeaders[key as HeaderType]);

  columns.push(...questions.map((question) => question.title));
  columns.push("Status");
  columns.push("Tidspunkt");

  return columns.filter((header) => header !== undefined).filter((header) => header.trim() !== "");
};
