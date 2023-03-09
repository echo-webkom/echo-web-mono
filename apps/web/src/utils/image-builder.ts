import imageUrlBuilder from "@sanity/image-url";
import {SanityImageSource} from "@sanity/image-url/lib/types/types";
import {sanityClient} from "@/api";

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
