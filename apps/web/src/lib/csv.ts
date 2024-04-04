import { Parser } from "@json2csv/plainjs";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";

import { type getFullHappening } from "@/data/happenings/queries";

const parser = new Parser({
  withBOM: true,
});

export const toCsv = (
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>,
  selectedHeaders: Array<string>,
): string => {
  const registrations = happening.registrations.map((r) => {
    const answers = r.answers.map((a) => ({
      questionId: a.questionId,
      question: happening.questions.find((q) => q.id === a.questionId)?.title ?? "Unknown question",
      answer: a.answer?.answer,
    }));
    const obj: Record<string, string> = {};
    obj.Epost = r.user.alternativeEmail ?? r.user.email;
    obj.Navn = r.user.name ?? "Ingen navn";
    obj.Status = r.status;
    obj.År = r.user.year?.toString() ?? "Ingen år";
    obj.Studieretning = r.user.degreeId ?? "Ingen studieretning";
    obj.Grunn = r.unregisterReason ?? "";

    const filteredObj: Record<string, string> = {};
    selectedHeaders.forEach((header) => {
      if (header === "Alternativ Epost") {
        header = "Epost";
      }
      if (header in obj) {
        filteredObj[header] = obj[header] ?? "";
      }
    });

    happening.questions.forEach((question) => {
      if (selectedHeaders.includes(question.title)) {
        const answer = answers.find((a) => a.questionId === question.id)?.answer;
        const formattedAnswer = Array.isArray(answer) ? answer.join(", ") : answer ?? "";
        filteredObj[question.title] = formattedAnswer;
      }
    });

    return filteredObj;
  });

  registrations.sort((a, b) => {
    const statusOrder: Record<RegistrationStatus, number> = {
      registered: 0,
      waiting: 1,
      unregistered: 2,
      removed: 3,
      pending: 4,
    };

    return (
      statusOrder[a.Status as RegistrationStatus] - statusOrder[b.Status as RegistrationStatus]
    );
  });

  return parser.parse(registrations);
};
