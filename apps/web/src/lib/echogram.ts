import "server-only";

import { EchoGram } from "@/api/echogram";

export const echoGram = new EchoGram(process.env.ECHOGRAM_API_KEY);
