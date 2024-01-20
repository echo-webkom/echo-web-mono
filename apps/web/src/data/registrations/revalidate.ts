import { revalidateTag } from "next/cache";
import { cacheKeyFactory } from "./cache-keys";
import type { Registration } from "@echo-webkom/db/schemas";
import { Happening, Registration } from "@echo-webkom/db/schemas";

export async function revalidateRegistrations(happeningId: string) {
revalidateTag(cacheKeyFactory.registrations(happeningId));}