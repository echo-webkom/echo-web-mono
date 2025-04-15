import { homeHappeningsQuery } from '@echo-webkom/sanity/queries';
import type { HomeHappeningsQueryResult } from '@echo-webkom/cms/types';
import { sanityCdn } from '.';

export const fetchUpcomingEvents = () =>
	sanityCdn.fetch<HomeHappeningsQueryResult>(homeHappeningsQuery, {
		happeningTypes: ['event', 'external'],
		n: 5
	});

export const fetchUpcomingBedpres = () => {
	return sanityCdn.fetch<HomeHappeningsQueryResult>(homeHappeningsQuery, {
		happeningTypes: ['bedpres'],
		n: 5
	});
};
