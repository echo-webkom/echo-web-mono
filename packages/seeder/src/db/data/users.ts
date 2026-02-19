import { fakerNB_NO as faker } from "@faker-js/faker";

import { pickRandom } from "../../utils";
import * as User from "../repo/user";

export const users = [
  {
    id: "student",
    name: "Student",
    email: "student@echo.uib.no",
    type: "student",
    token: "student",
    isPublic: true,
  },

  {
    id: "student2",
    name: "Student2",
    email: "student2@echo.uib.no",
    type: "student",
    token: "student2",
    year: 2,
    isPublic: false,
  },

  {
    id: "student5",
    name: "Student5",
    email: "student5@echo.uib.no",
    type: "student",
    token: "student5",
    year: 5,
    isPublic: true,
  },

  {
    id: "alum",
    name: "Andreas Aanes",
    email: "alum@echo.uib.no",
    type: "alum",
    token: "alum",
    isPublic: true,
  },

  {
    id: "admin",
    name: "Bo Salhus",
    email: "admin@echo.uib.no",
    type: "student",
    token: "admin",
    isPublic: true,
  },

  {
    id: "hyggkom",
    name: "Hyggkom",
    email: "hyggkom@echo.uib.no",
    type: "student",
    token: "hyggkom",
    isPublic: true,
  },
  {
    id: "unethical",
    name: "Unethical",
    email: "unethical@echo.uib.no",
    type: "student",
    token: "unethical",
    year: 2,
    hasReadTerms: false,
    isPublic: false,
  },
] as const;

export const createFakeUsers = async (n: number) => {
  faker.seed(42);

  await Promise.all(
    Array.from({ length: n }, (_, i) =>
      User.create({
        id: `fake-user-${i}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        type: "student",
        token: `fake-user-${i}`,
        hasReadTerms: true,
        isPublic: pickRandom([true, false]),
        degreeId: pickRandom(["dtek", "dsik", "prog", "inf", "dsc", "dvit"]),
        year: pickRandom([1, 2, 3, 4, 5]),
      }),
    ),
  );
};
