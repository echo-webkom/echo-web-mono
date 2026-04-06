import { NextResponse } from "next/server";

import { UNO_BASE_URL } from "@/config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(`${UNO_BASE_URL}/auth/feide`, {
    status: 302,
  });
}
