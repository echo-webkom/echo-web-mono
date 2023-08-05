import {rm} from "node:fs/promises";
import path from "node:path";

(async () => {
  await rm(path.join(process.cwd(), "types.ts"));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
