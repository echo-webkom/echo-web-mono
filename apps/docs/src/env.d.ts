import type { Runtime } from "@astrojs/cloudflare";

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Locals extends Runtime<Env> {}
}
