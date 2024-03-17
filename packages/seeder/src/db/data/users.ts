import * as User from "../repo/user";

export const users = [
  {
    id: "student",
    name: "Student",
    email: "student@echo.uib.no",
    type: "student",
    token: "student",
  },

  {
    id: "student2",
    name: "Student2",
    email: "student2@echo.uib.no",
    type: "student",
    token: "student2",
    year: 2,
  },

  {
    id: "student5",
    name: "Student5",
    email: "student5@echo.uib.no",
    type: "student",
    token: "student5",
    year: 5,
  },

  {
    id: "alum",
    name: "Andreas Aanes",
    email: "alum@echo.uib.on",
    type: "alum",
    token: "alum",
  },

  {
    id: "admin",
    name: "Bo Salhus",
    email: "admin@echo.uib.on",
    type: "student",
    token: "admin",
  },
] as const;

export const createFakeUsers = async (n: number) => {
  await Promise.all(
    Array.from({ length: n }, (_, i) =>
      User.create({
        id: `student${i}`,
        name: `Student ${i}`,
        email: `student${i}@uib.no`,
        type: "student",
        token: `student${i}`,
      }),
    ),
  );
};
