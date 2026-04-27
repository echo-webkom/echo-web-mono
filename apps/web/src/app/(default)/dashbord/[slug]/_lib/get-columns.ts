import { type DashboardQuestion } from "./types";

type HeaderType = "name" | "email" | "alternativeEmail" | "degreeId" | "year" | "status";

const formatHeaders: Record<HeaderType, string> = {
  name: "Navn",
  email: "Epost",
  alternativeEmail: "Alternativ Epost",
  year: "År",
  degreeId: "Studieretning",
  status: "Status",
};

const baseColumns: Array<string> = [
  formatHeaders.name,
  formatHeaders.email,
  formatHeaders.alternativeEmail,
  formatHeaders.year,
  formatHeaders.degreeId,
];

export const getColumns = (questions: Array<DashboardQuestion>) => {
  const columns = [...baseColumns];

  columns.push(...questions.map((question) => question.title));
  columns.push("Status");
  columns.push("Tidspunkt");

  return columns.filter((header) => header !== undefined).filter((header) => header.trim() !== "");
};
