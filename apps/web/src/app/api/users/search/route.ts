import { NextResponse, type NextRequest } from "next/server";
import { ilike } from "drizzle-orm";

import { db } from "@echo-webkom/db/serverless";

import { auth } from "@/auth/session";

export async function GET(request: NextRequest) {
  try {
    const user = await auth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const users = await db.query.users.findMany({
      where: (user) => ilike(user.name, `%${query}%`),
      columns: {
        id: true,
        name: true,
      },
      orderBy: (user, { asc }) => [asc(user.name)],
      limit: 20,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
