import { expect, test } from "vitest";

import { validateQuestions, type Question } from "@/utils/validate-questions";

test("text", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "text",
      required: true,
      options: null,
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: "answer",
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(true);
});

test("text required", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "text",
      required: true,
      options: null,
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: "",
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(false);
});

test("text not required", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "text",
      required: false,
      options: null,
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: "",
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(true);
});

test("radio", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "radio",
      required: true,
      options: [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ],
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: "1",
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(true);
});

test("radio required", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "radio",
      required: true,
      options: [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ],
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: "",
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(false);
});

test("radio not required", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "radio",
      required: false,
      options: [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ],
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: "",
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(true);
});

test("checkbox", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "checkbox",
      required: true,
      options: [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ],
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: ["1"],
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(true);
});

test("checkbox required", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "checkbox",
      required: true,
      options: [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ],
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: [],
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(false);
});

test("checkbox not required", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "checkbox",
      required: false,
      options: [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ],
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: [],
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(true);
});

test("checkbox invalid answer", () => {
  const questions: Array<Question> = [
    {
      id: "1",
      type: "checkbox",
      required: true,
      options: [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
      ],
      isSensitive: false,
    },
  ];
  const answers = [
    {
      questionId: "1",
      answer: ["4"],
    },
  ];

  expect(validateQuestions(questions, answers)).toBe(false);
});
