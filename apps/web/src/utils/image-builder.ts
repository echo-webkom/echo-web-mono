import imageUrlBuilder from "@sanity/image-url";
import {type SanityImageSource} from "@sanity/image-url/lib/types/types";

import {sanityClient} from "@/api/sanity.client";

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
