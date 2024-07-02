import { Cache } from "./cache";

const PREFIX = "signin";

type SignInAttemptCache = {
  email: string;
  error: string;
};

export const setSignInAttempt = async (id: string, email: string, error: string) => {
  await Cache.set(`${PREFIX}:${id}`, {
    email,
    error,
  });
};

export const getSignInAttempt = async (id: string) => {
  return Cache.get<SignInAttemptCache>(`${PREFIX}:${id}`);
};
