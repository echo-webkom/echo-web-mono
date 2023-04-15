import {NextResponse, type NextRequest} from "next/server";

export const config = {
  matcher: ["/", "/api/sanity", "/api/basicauth"],
};
export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    if (!authValue) {
      return NextResponse.redirect("/api/auth");
    }
    const [user, password] = window.atob(authValue).split(":");

    if (user?.toLowerCase() === "admin" && password === process.env.ADMIN_KEY) {
      return NextResponse.next();
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
