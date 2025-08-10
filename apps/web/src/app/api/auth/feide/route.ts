import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateState } from "arctic";

import { feide } from "@/auth/feide";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();

  const state = generateState();
  const url = feide.createAuthorizationURL(state);

  cookieStore.set("feide_oauth_state", state, {
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  return redirect(url.toString());
}
