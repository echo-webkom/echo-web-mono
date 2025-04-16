import { AxisClient } from '@echo-webkom/axis-client';
import {
	PUBLIC_AXIS_URL,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_PROJECT_ID
} from '$env/static/public';
import { dev } from '$app/environment';

export const axis = new AxisClient({
	axisUrl: PUBLIC_AXIS_URL!,
	sanity: {
		projectId: PUBLIC_SANITY_PROJECT_ID!,
		dataset: PUBLIC_SANITY_DATASET!
	},
	debug: dev
});
