import { type NextRequest } from "next/server";

import { getFullHappening } from "@/data/happenings/queries";
import { toCsv } from "@/lib/csv";
import { getUser } from "@/lib/get-user";
import { isHost } from "@/lib/memberships";
import { slugify } from "@/utils/string";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const user = await getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const encodedHeaders = req.nextUrl.searchParams.getAll("header") ?? [];
  const selectedHeaders = encodedHeaders.map((header) => decodeURIComponent(header));

  const happening = await getFullHappening(slug);

  if (!happening) {
    return new Response("Happening not found", { status: 404 });
  }

  if (!isHost(user, happening)) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(toCsv(happening, selectedHeaders), {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename=${slugify(happening.title)}-registrations.csv`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
};
