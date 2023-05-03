import {Buffer} from "node:buffer";
import {NextResponse, type NextRequest} from "next/server";

import {env} from "./env.mjs";

export const config = {
  runtime: "experimental-edge",
  matcher: ["/api/sanity"],
};
export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    if (!authValue) {
      return NextResponse.redirect("/");
    }

    const [user, password] = Buffer.from(authValue, "base64").toString().split(":");

    if (user?.toLowerCase() === "admin" && password === env.ADMIN_KEY) {
      return NextResponse.next();
    }
  }
  url.pathname = "/";

  return NextResponse.redirect(url);
}
