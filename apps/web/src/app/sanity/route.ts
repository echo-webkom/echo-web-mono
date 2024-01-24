import { redirect } from "next/navigation";

export function GET() {
  if (process.env.NODE_ENV === "production") {
    return redirect("https://cms.echo.uib.no");
  }

  return redirect("http://localhost:3333");
}
