import { Parser } from "@json2csv/plainjs";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";

import { type getFullHappening } from "@/data/happenings/queries";
import { stringify } from "@/utils/string";

const parser = new Parser({
  withBOM: true,
});

type FullHappening = Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;

/**
 * Converts a happening to a CSV string.
 * If selectedHeaders is empty, all headers will be included.
 *
 * @param happening the happening to convert to CSV
 * @param selectedHeaders the headers to include in the CSV
 * @returns the CSV string
 */
export function toCsv(happening: FullHappening, selectedHeaders: Array<string> = []) {
  const registrations = happening.registrations.map((r) => {
    const answers = r.answers.map((a) => ({
      questionId: a.questionId,
      question: happening.questions.find((q) => q.id === a.questionId)?.title ?? "Unknown question",
      answer: a.answer?.answer,
    }));

    const obj: Record<string, string> = {};
    obj.Navn = stringify(r.user.name);
    obj.Epost = r.user.alternativeEmail ?? r.user.email;
    obj.Status = r.status;
    obj.År = stringify(r.user.year);
    obj.Studieretning = r.user.degreeId ?? "";
    obj.Grunn = r.unregisterReason ?? "";
    obj.Status = r.status;

    happening.questions.forEach((question) => {
      const answer = answers.find((a) => a.questionId === question.id)?.answer;
      const formattedAnswer = Array.isArray(answer) ? answer.join(", ") : answer ?? "";
      obj[question.title] = formattedAnswer;
    });

    // If there are no selected headers, return the full object
    if (selectedHeaders.length > 0) {
      for (const key in obj) {
        if (!selectedHeaders.includes(key)) {
          delete obj[key];
        }
      }
    }

    return obj;
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
}
