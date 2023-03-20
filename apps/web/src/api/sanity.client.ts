import {createClient} from "next-sanity";

export const sanityClient = createClient({
  projectId: "pgq2pd26",
  dataset: "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});
