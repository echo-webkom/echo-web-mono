import { pgGenerate } from "drizzle-dbml-generator";

import * as schema from "../src/db/schemas";

const out = "./drizzle/schema.dbml";
const relational = true;

pgGenerate({ schema, out, relational });
