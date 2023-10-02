import { type Hono } from "hono";

type SignInJSON = Partial<{
  email: string;
  password: string;
}>;

export const signIn = async <T extends SignInJSON>(
  app: Hono,
  { email = "test@test.com", password = "password123" }: T = {
    email: "test@test.com",
    password: "password123",
  } as T,
) => {
  return await app.request("http://localhost:3000/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

type SignUpJSON = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}>;

export const signUp = async <T extends SignUpJSON>(
  app: Hono,
  {
    firstName = "Test",
    lastName = "Test",
    email = "test@test.com",
    password = "password123",
  }: T = {
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    password: "password123",
  } as T,
) => {
  return await app.request("http://localhost:3000/auth/sign-up", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });
};

export const signOut = async (app: Hono) => {
  return await app.request("http://localhost:3000/auth/sign-out", {
    method: "POST",
  });
};

export const getJwt = (resp: Response) => resp.headers.getSetCookie()[0]?.split("; ")[0]?.slice(5);

export const getUserCookie = (resp: Response) =>
  resp.headers
    .getSetCookie()[0]
    ?.split("; ")
    .find((c) => c.startsWith("user="));
