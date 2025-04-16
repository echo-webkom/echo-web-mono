import { env } from '$env/dynamic/public';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Project ID: "pgq2pd26",
 *
 * Datasets:
 * "production", "develop", "testing"
 */
export const DEFAULT_PROJECT_ID = 'pgq2pd26';
export const DEFAULT_DATASET = 'production';

export const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID;
export const dataset = env.PUBLIC_SANITY_DATASET ?? DEFAULT_DATASET;
export const apiVersion = '2023-05-03';

export const sanity = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false
});

export const sanityCdn = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false
});

const builder = imageUrlBuilder(sanityCdn);
export const urlFor = (source: SanityImageSource) => {
	return builder.image(source);
};
