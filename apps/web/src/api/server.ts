import "server-only";

import { apiClient } from "./client";

export const apiServer = apiClient.extend({
  headers: {
    Authorization: "Bearer foobar",
  },
});
