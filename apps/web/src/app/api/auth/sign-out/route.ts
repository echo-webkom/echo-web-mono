import { signOut } from "@/auth/session";

export async function POST() {
  await signOut();

  return new Response(null, {
    status: 200,
  });
}
