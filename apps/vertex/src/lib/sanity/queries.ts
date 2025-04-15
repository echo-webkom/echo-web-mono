import { homeHappeningsQuery, staticInfoQuery } from '@echo-webkom/sanity/queries';
import type { HomeHappeningsQueryResult, StaticInfoQueryResult } from '@echo-webkom/cms/types';
import { sanityCdn } from '.';
import type { PageType } from '@echo-webkom/lib';

export const fetchUpcomingEvents = async () => {
	return await sanityCdn.fetch<HomeHappeningsQueryResult>(homeHappeningsQuery, {
		happeningTypes: ['event', 'external'],
		n: 5
	});
};

export const fetchUpcomingBedpres = async () => {
	return await sanityCdn.fetch<HomeHappeningsQueryResult>(homeHappeningsQuery, {
		happeningTypes: ['bedpres'],
		n: 5
	});
};

export const fetchStaticPage = async (pageType: PageType, slug: string) => {
	const data = await sanityCdn.fetch<StaticInfoQueryResult>(staticInfoQuery);
	return data.find((page) => page.pageType === pageType && page.slug === slug);
};
