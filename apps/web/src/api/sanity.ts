import {env} from "@/env.mjs";
import {createClient} from "next-sanity";

const SanityAPI = createClient({
  projectId: "pgq2pd26",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});

export default SanityAPI;
