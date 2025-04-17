import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { axis } from '../axis/client.server';

const sanity = axis.sanity();

const builder = imageUrlBuilder(sanity);
export const urlFor = (source: SanityImageSource) => {
	return builder.image(source);
};
