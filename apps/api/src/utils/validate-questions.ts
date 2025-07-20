import type { Question as BaseQuestion } from "@echo-webkom/db/schemas";

export type Question = Omit<BaseQuestion, "happeningId" | "title">;

export type Answer = {
  questionId: string;
  answer: string | Array<string>;
};

export function validateQuestions(questions: Array<Question>, answers: Array<Answer>) {
  return questions.every((question) => {
    const questionExists = answers.find((q) => q.questionId === question.id);
    const questionAnswer = questionExists?.answer;

    if (!questionAnswer) {
      return !question.required;
    }

    switch (question.type) {
      case "text":
        return validateText(question, questionAnswer);
      case "radio":
        return validateRadio(question, questionAnswer);
      case "checkbox":
        return validateCheckbox(question, questionAnswer);
      default:
        return false;
    }
  });
}

function validateText(question: Question, answer: string | Array<string>) {
  if (typeof answer !== "string") {
    return false;
  }

  return question.required ? answer.length > 0 : true;
}

function validateRadio(question: Question, answer: string | Array<string>) {
  if (typeof answer !== "string") {
    return false;
  }

  return question.required ? answer.length > 0 : true;
}

function validateCheckbox(question: Question, answer: string | Array<string>) {
  if (!Array.isArray(answer)) {
    return false;
  }

  if (answer.some((a) => typeof a !== "string")) {
    return false;
  }

  if (!question.required) {
    return true;
  }

  const isValid = answer.every((a) => question.options?.map((o) => o.value).includes(a));

  return isValid && answer.length > 0;
}
