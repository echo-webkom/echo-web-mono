import {sanityClient} from "@/api/sanity.client";
import imageUrlBuilder from "@sanity/image-url";
import {type SanityImageSource} from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
