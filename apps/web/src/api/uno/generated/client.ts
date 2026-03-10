import createClient from "openapi-fetch";

import { type paths } from "./types";

export const internal = createClient<paths>({
  baseUrl: "/api/uno",
});
