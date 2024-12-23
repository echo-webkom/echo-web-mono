import { cache } from "react";

import { auth } from "@/auth/helpers";

/**
 * Wraps the `auth` function in a "cache" to prevent
 * multiple calls to the auth server.
 *
 * This cache only lives for the duration of the page
 * load.
 */
export const getUser = cache(auth);
