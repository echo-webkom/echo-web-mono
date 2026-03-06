import { describe, expect, it } from "vitest";

import { toCsv, type FullHappening } from "../csv";

const createHappening = (happening: Partial<FullHappening>): FullHappening => {
  return {
    date: null,
    id: "1",
    type: "event",
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

const fixedDate = new Date("2024-01-15T10:30:00.000Z");

const happening = createHappening({
  registrations: [
    {
      userId: "1",
      userName: "Petter Kjellberg",
      userEmail: null,
      userYear: null,
      userDegreeId: null,
      userHasImage: false,
      happeningId: "1",
      changedAt: fixedDate,
      changedBy: null,
      createdAt: fixedDate,
      prevStatus: "waiting",
      status: "registered",
      unregisterReason: null,
      answers: [
        {
          questionId: "q1",
          answer: "yes",
        },
        {
          questionId: "q2",
          answer: "no",
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
      `"Navn","Epost","Status","År","Studieretning","Question 1","Question 2","Tidspunkt"\n"Petter Kjellberg","","registered","","","yes","no","${fixedDate}"`,
    );
  });

  it.each([
    {
      headers: ["Navn", "Studieretning"],
      expected: `"Navn","Studieretning"\n"Petter Kjellberg",""`,
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
