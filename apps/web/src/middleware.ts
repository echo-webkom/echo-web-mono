import {NextResponse, type NextRequest} from "next/server";

export const config = {
  matcher: ["/api/sanity"],
};
export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    if (!authValue) {
      return NextResponse.redirect("/");
    }
    const [user, password] = Buffer.from(authValue, "base64").toString().split(":");

    if (user?.toLowerCase() === "admin" && password === process.env.ADMIN_KEY) {
      return NextResponse.next();
    }
  }
  url.pathname = "/";

  return NextResponse.redirect(url);
}
