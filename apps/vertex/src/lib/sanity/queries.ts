import { homeHappeningsQuery, jobAdsQuery, staticInfoQuery } from '@echo-webkom/sanity/queries';
import type {
	HomeHappeningsQueryResult,
	JobAdsQueryResult,
	StaticInfoQueryResult
} from '@echo-webkom/cms/types';
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

export const fetchJobs = async () => {
	return await sanityCdn.fetch<JobAdsQueryResult>(jobAdsQuery);
};
