import { describe, expect, it } from "vitest";
import { toCsv } from "../csv";
import { happeningTypeEnum } from "@echo-webkom/db/schemas";

//TODO: funka de??
describe("toCsv", () => {
  it("should convert happening data to CSV format", () => {
    const happening = {
      registrations: [
        {
          user: {
            alternativeEmail: "supah@gmail.com",
            name: "Petter Kjellberg",
            year: 2022,
            degreeId: "Computer Science",
          },
          status: "registered",
          unregisterReason: "",
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
          id: "q1",
          title: "Question 1",
        },
        {
          id: "q2",
          title: "Question 2",
        },
      ],
    };

    const happeningData = {
      ...happening,
      date: null,
      id: "",
      type: happeningTypeEnum.enumValues[1],
      slug: "",
      title: "",
      registrationGroups: null,
      registrationStartGroups: null,
      registrationStart: null,
      registrationEnd: null,
      registrations: [],
      questions: [],
      groups: []
    };

    const selectedHeaders: Array<string> = ["Navn", "Epost", "Status", "År", "Studieretning", "Question 1", "Question 2"];
    const csv = toCsv(happeningData, selectedHeaders);

    expect(csv).toBe(`Navn,Epost,Status,År,Studieretning,Question 1,Question 2
  Petter Kjellberg,supah@gmail.com,registered,2022,Computer Science,yes,no`);
  })
});
