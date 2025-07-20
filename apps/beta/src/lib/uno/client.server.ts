import { UnoClient } from '@echo-webkom/uno-client';
import {
	PUBLIC_UNO_URL,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_PROJECT_ID
} from '$env/static/public';
import { dev } from '$app/environment';
import { ADMIN_KEY } from '$env/static/private';

export const uno = new UnoClient({
	baseUrl: PUBLIC_UNO_URL!,
	sanity: {
		projectId: PUBLIC_SANITY_PROJECT_ID!,
		dataset: PUBLIC_SANITY_DATASET!
	},
	apiToken: ADMIN_KEY,
	debug: dev
});
