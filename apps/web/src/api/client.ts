import ky from "ky";

export const apiClient = ky.extend({
  // TODO: Change to env variable
  prefixUrl: "http://localhost:8000",
});
