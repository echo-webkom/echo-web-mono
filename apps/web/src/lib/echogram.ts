import "server-only";

import { EchoGram } from "@echo-webkom/echogram";

export const echoGram = new EchoGram(process.env.ECHOGRAM_API_KEY);
