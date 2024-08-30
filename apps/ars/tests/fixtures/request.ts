import { env } from "./env";

export const defaultRequest = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.ADMIN_KEY}`,
  },
  body: JSON.stringify({
    userId: "foo",
    happeningId: "bedpres",
    questions: [],
  }),
};
