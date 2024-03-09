import { echoGram } from "@/lib/echogram";
import { createAuthedRoute } from "@/lib/factories/route";

export const GET = createAuthedRoute(async (req, _ctx, { user }) => {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return new Response("Missing userId or file", { status: 400 });
  }

  const response = await echoGram.uploadImage(user.id, file);

  return new Response("OK", {
    status: response.success ? 200 : 400,
  });
});
