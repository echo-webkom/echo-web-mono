import { type RegistrationStatus } from "@echo-webkom/db/schemas";
import { Parser } from "@json2csv/plainjs";

import { type FullHappening } from "@/api/uno/client";
import { stringify } from "@/utils/string";

export type { FullHappening };

/**
 * Converts a happening to a CSV string.
 * If selectedHeaders is empty, all headers will be included.
 *
 * @param happening the happening to convert to CSV
 * @param selectedHeaders the headers to include in the CSV
 * @returns the CSV string
 */
export const toCsv = (happening: FullHappening, selectedHeaders: Array<string> = []) => {
  const registrations = happening.registrations
    .sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    })
    .map((r) => {
      const answers = r.answers.map((a) => ({
        questionId: a.questionId,
        question:
          happening.questions.find((q) => q.id === a.questionId)?.title ?? "Unknown question",
        answer: Array.isArray(a.answer) ? a.answer : (a.answer ?? undefined),
      }));

      const obj: Record<string, string> = {};
      obj.Navn = r.userName ?? "";
      obj.Epost = r.userEmail ?? "";
      obj.Status = r.status;
      obj.År = r.userYear !== null ? String(r.userYear) : "";
      obj.Studieretning = r.userDegreeId ?? "";
      obj.Grunn = r.unregisterReason ?? "";

      happening.questions.forEach((question) => {
        const answer = answers.find((a) => a.questionId === question.id)?.answer;
        const formattedAnswer = Array.isArray(answer) ? answer.join(", ") : (answer ?? "");
        obj[question.title] = formattedAnswer;
      });

      obj.Tidspunkt = r.changedAt ? stringify(r.changedAt) : stringify(r.createdAt);

      return obj;
    })
    .sort((a, b) => {
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
    })
    .map((registration) => {
      const obj: Record<string, string> = registration;

      for (const key in registration) {
        if (!selectedHeaders.includes(key)) {
          delete obj[key];
        }
      }

      return obj;
    });

  const parser = new Parser();
  return parser.parse(registrations);
};
