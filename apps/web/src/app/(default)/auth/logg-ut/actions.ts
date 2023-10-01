"use server";

import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/require-await
export async function logOutAction() {
  console.log("Delteing cookie");
  cookies().delete({
    name: "user",
    domain: "localhost",
    path: "/",
  });
}
