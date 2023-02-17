import { createClient } from "next-sanity";
// import imageUrlBuilder from "@sanity/image-url";
// import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const SanityAPI = createClient({
  projectId: "pgq2pd26",
  dataset: process.env.SANITY_DATASET ?? "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});

// const builder = imageUrlBuilder(SanityAPI);

// const imgUrlFor = (source: SanityImageSource) => {
//   return builder.image(source);
// };

export default SanityAPI;
// export { imgUrlFor };
