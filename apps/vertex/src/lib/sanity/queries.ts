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

export const fetchPosts = async () => {
	return await sanityCdn.fetch<AllPostsQueryResult>(allPostsQuery);
};

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

export const fetchGroupBySlug = async (slug: string) => {
	return await sanityCdn.fetch<StudentGroupBySlugQueryResult>(studentGroupBySlugQuery, {
		slug
	});
};

export const fetchMinutes = async () => {
	return await sanityCdn.fetch<AllMeetingMinuteQueryResult>(allMeetingMinuteQuery);
};
