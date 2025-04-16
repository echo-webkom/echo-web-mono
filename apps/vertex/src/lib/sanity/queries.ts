import {
	allMeetingMinuteQuery,
	allPostsQuery,
	homeHappeningsQuery,
	jobAdsQuery,
	staticInfoQuery,
	studentGroupBySlugQuery,
	studentGroupsByTypeQuery
} from '@echo-webkom/sanity/queries';
import type {
	StudentGroupBySlugQueryResult,
	AllPostsQueryResult,
	HomeHappeningsQueryResult,
	JobAdsQueryResult,
	StaticInfoQueryResult,
	StudentGroupsByTypeQueryResult,
	AllMeetingMinuteQueryResult
} from '@echo-webkom/cms/types';
import { sanityCdn } from '.';
import type { PageType } from '@echo-webkom/lib';

/**
 * Fetches the next upcoming events from sanity
 *
 * @returns
 */
export const fetchUpcomingEvents = async () => {
	return await sanityCdn.fetch<HomeHappeningsQueryResult>(homeHappeningsQuery, {
		happeningTypes: ['event', 'external'],
		n: 5
	});
};

/**
 * Fetches the next upcoming bedpres from sanity
 *
 * @returns
 */
export const fetchUpcomingBedpres = async () => {
	return await sanityCdn.fetch<HomeHappeningsQueryResult>(homeHappeningsQuery, {
		happeningTypes: ['bedpres'],
		n: 5
	});
};

/**
 * Fetches a static page from sanity based on the page type and slug
 *
 * @param pageType
 * @param slug
 * @returns
 */
export const fetchStaticPage = async (pageType: PageType, slug: string) => {
	const data = await sanityCdn.fetch<StaticInfoQueryResult>(staticInfoQuery);
	return data.find((page) => page.pageType === pageType && page.slug === slug);
};

/**
 * Fetches the available job ads from sanity
 *
 * @returns
 */
export const fetchJobs = async () => {
	return await sanityCdn.fetch<JobAdsQueryResult>(jobAdsQuery);
};

/**
 * Fetches all the posts from sanity
 *
 * @returns
 */
export const fetchPosts = async () => {
	return await sanityCdn.fetch<AllPostsQueryResult>(allPostsQuery);
};

/**
 * Fetches all the groups based on the type from sanity
 *
 * @param type
 * @returns
 */
export const fetchGroupsByType = async (type: string) => {
	return await sanityCdn
		.fetch<StudentGroupsByTypeQueryResult>(studentGroupsByTypeQuery, {
			type,
			n: -1
		})
		.then((groups) => {
			return groups.sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		});
};

/**
 * Fetches the group by slug from sanity
 *
 * @param slug
 * @returns
 */
export const fetchGroupBySlug = async (slug: string) => {
	return await sanityCdn.fetch<StudentGroupBySlugQueryResult>(studentGroupBySlugQuery, {
		slug
	});
};

/**
 * Fetches all the meeting minutes from sanity
 *
 * @returns
 */
export const fetchMinutes = async () => {
	return await sanityCdn.fetch<AllMeetingMinuteQueryResult>(allMeetingMinuteQuery);
};
