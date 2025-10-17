import { users } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";
import { givenIHaveDegrees } from "./degrees";

export async function givenIHaveUsers() {
  await givenIHaveDegrees();

  await db
    .insert(users)
    .values([
      {
        id: "1",
        name: "Andreas Aanes",
        email: "andreas@echo.uib.no",
        year: 3,
        degreeId: "dtek",
        hasReadTerms: true,
        isPublic: true,
      },
      {
        id: "2",
        name: "Bo Bakseter",
        email: "bo@echo.uib.no",
        year: 5,
        degreeId: "dtek",
        hasReadTerms: true,
        isPublic: false,
      },
    ])
    .onConflictDoNothing();
}

export const userList = [
  {
    id: "1",
    name: "User 1",
    email: "user1@echo.uib.no",
    year: 2,
    degreeId: "dtek",
    hasReadTerms: true,
    isPublic: true,
  },
  {
    id: "2",
    name: "User 2",
    email: "user2@echo.uib.no",
    year: 4,
    degreeId: "dtek",
    hasReadTerms: true,
    isPublic: true,
  },
  {
    id: "3",
    name: "User 3",
    email: "user3@echo.uib.no",
    year: 2,
    degreeId: "dtek",
    hasReadTerms: true,
    isPublic: true,
  },
  {
    id: "4",
    name: "User 4",
    email: "user4@echo.uib.no",
    year: 3,
    degreeId: "dtek",
    hasReadTerms: true,
    isPublic: true,
  },
  {
    id: "5",
    name: "User 5",
    email: "user5@echo.uib.no",
    year: 5,
    degreeId: "dtek",
    hasReadTerms: true,
    isPublic: true,
  },
  {
    id: "6",
    name: "User 6",
    email: "user6@echo.uib.no",
    year: 4,
    degreeId: "dtek",
    hasReadTerms: true,
    isPublic: false,
  },
];
