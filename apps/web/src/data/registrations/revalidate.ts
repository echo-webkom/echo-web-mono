import { revalidateTag } from "next/cache";
import { cacheKeyFactory } from "./cache-keys";


export async function revalidateRegistrations(happeningId: string) {
    revalidateTag(cacheKeyFactory.registrations(happeningId));
}