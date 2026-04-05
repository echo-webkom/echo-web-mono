import { NextResponse } from "next/server";

const UNO_URL = process.env.UNO_URL ?? "http://localhost:8000";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(`${UNO_URL}/auth/feide`, {
    status: 302,
  });
}
