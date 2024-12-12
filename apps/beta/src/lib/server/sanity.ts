import type {
	StaticInfoQueryResult,
	AllMeetingMinuteQueryResult,
	StudentGroupsByTypeQueryResult,
	StudentGroupBySlugQueryResult
} from '@echo-webkom/cms/types';
import { cdnClient } from '@echo-webkom/sanity';
import {
	staticInfoQuery,
	allMeetingMinuteQuery,
	studentGroupsByTypeQuery,
	studentGroupBySlugQuery
} from '@echo-webkom/sanity/queries';

export const sanity = cdnClient;

export const fetchStaticPage = async (pageType: string, slug: string) => {
	return await sanity.fetch<StaticInfoQueryResult>(staticInfoQuery).then((result) => {
		return result.find((item) => item.pageType === pageType && item.slug === slug);
	});
};

export const fetchMinutes = async () => {
	return await sanity.fetch<AllMeetingMinuteQueryResult>(allMeetingMinuteQuery);
};

export const fetchGroupsByType = async (type: string) => {
	const internalType = {
		undergrupper: 'subgroup',
		idrettslag: 'sport',
		interessegrupper: 'intgroup',
		hovedstyre: 'board',
		underorganisasjoner: 'suborg',
		skjult: 'hidden'
	}[type];

	if (!internalType) {
		return [];
	}

	return await sanity.fetch<StudentGroupsByTypeQueryResult>(studentGroupsByTypeQuery, {
		type: internalType,
		n: -1
	});
};

export const fetchGroupBySlug = async (slug: string) => {
	return await sanity.fetch<StudentGroupBySlugQueryResult>(studentGroupBySlugQuery, {
		slug
	});
};
