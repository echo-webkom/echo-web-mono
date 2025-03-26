import { describe, expect, it } from "vitest";

import { happeningTypeEnum } from "@echo-webkom/db/schemas";

import { toCsv, type FullHappening } from "../csv";

const createHappening = (happening: Partial<FullHappening>): FullHappening => {
  return {
    date: null,
    id: "1",
    type: happeningTypeEnum.enumValues[1],
    slug: "",
    title: "",
    registrationGroups: null,
    registrationStartGroups: null,
    registrationStart: null,
    registrationEnd: null,
    registrations: [],
    questions: [],
    groups: [],
    ...happening,
  };
};

const petter = {
  alternativeEmail: "supah@gmail.com",
  name: "Petter Kjellberg",
  year: 2022,
  degreeId: "Computer Science",
  hasReadTerms: true,
  isPublic: false,
  bannedFromStrike: null,
  isBanned: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "1",
  email: "supah@gmail.com",
  image: null,
  emailVerified: new Date(),
  type: "student",
  lastSignInAt: new Date(),
  birthday: null,
} satisfies FullHappening["registrations"][number]["user"];

const happening = createHappening({
  registrations: [
    {
      user: petter,
      status: "registered",
      unregisterReason: "",
      prevStatus: "waiting",
      changedAt: new Date(),
      changedBy: null,
      createdAt: new Date(),
      happeningId: "1",
      userId: "1",
      answers: [
        {
          questionId: "q1",
          answer: {
            answer: "yes",
          },
          happeningId: "1",
          userId: "1",
        },
        {
          questionId: "q2",
          answer: {
            answer: "no",
          },
          happeningId: "1",
          userId: "1",
        },
      ],
    },
  ],
  questions: [
    {
      happeningId: "1",
      id: "q1",
      isSensitive: false,
      options: null,
      required: false,
      title: "Question 1",
      type: "text",
    },
    {
      happeningId: "1",
      id: "q2",
      title: "Question 2",
      type: "text",
      isSensitive: false,
      options: null,
      required: false,
    },
  ],
});

describe("toCsv", () => {
  it("should convert happening data to CSV format", () => {
    const selectedHeaders: Array<string> = [
      "Navn",
      "Epost",
      "Status",
      "År",
      "Studieretning",
      "Question 1",
      "Question 2",
      "Tidspunkt",
    ];
    const csv = toCsv(happening, selectedHeaders);

    expect(csv).toBe(
      `"Navn","Epost","Status","År","Studieretning","Question 1","Question 2","Tidspunkt"\n"Petter Kjellberg","supah@gmail.com","registered","2022","Computer Science","yes","no","${new Date()}"`,
    );
  });

  it.each([
    {
      headers: ["Navn", "Studieretning"],
      expected: `"Navn","Studieretning"\n"Petter Kjellberg","Computer Science"`,
    },
    {
      headers: ["Navn", "Status"],
      expected: `"Navn","Status"\n"Petter Kjellberg","registered"`,
    },
  ])("should return selected headers", ({ headers, expected }) => {
    const csv = toCsv(happening, headers);

    expect(csv).toBe(expected);
  });
});
