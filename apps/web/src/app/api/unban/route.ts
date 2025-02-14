import { withBearerAuth } from "@/lib/checks/with-bearer-auth";

export const POST = withBearerAuth(() => {
  return new Response("ok");
});
