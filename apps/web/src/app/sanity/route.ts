import { redirect } from "next/navigation";

import { createRoute } from "@/lib/factories/route";

export const GET = createRoute(() => {
  if (process.env.NODE_ENV === "production") {
    return redirect("https://cms.echo.uib.no");
  }

  return redirect("http://localhost:3333");
});
