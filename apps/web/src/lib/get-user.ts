import { cache } from "react";

import { auth } from "@echo-webkom/auth";

/**
 * Wraps the `auth` function in a "cache" to prevent
 * multiple calls to the auth server.
 *
 * This cache only lives for the duration of the page
 * load.
 */
export const getUser = cache(auth);
