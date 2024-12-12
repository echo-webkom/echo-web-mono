import { fetchByLaws, fetchEthicalGuidelines } from '$lib/github-content';
import { fetchStaticPage } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	const { path } = params;
	const parts = path.split('/');

	if (parts[0] === 'om') {
		if (parts[1] === 'vedtekter') {
			const bylaws = await fetchByLaws();
			return {
				title: 'Vedtekter',
				content: await marked(bylaws)
			};
		}

		if (parts[1] === 'retningslinjer') {
			const guidelines = await fetchEthicalGuidelines();
			return {
				content: await marked(guidelines)
			};
		}

		const page = await fetchStaticPage('about', parts[1]);

		if (!page) {
			throw error(404, 'Finner ikke siden');
		}

		return {
			title: page?.title || 'Om oss',
			content: await marked(page?.body || '')
		};
	}

	if (parts[0] === 'for-bedrifter') {
		const page = await fetchStaticPage('for-companies', parts[1]);

		if (!page) {
			throw error(404, 'Finner ikke siden');
		}

		return {
			title: page?.title || 'For bedrifter',
			content: await marked(page?.body || '')
		};
	}

	if (parts[0] === 'for-studenter') {
		const page = await fetchStaticPage('for-students', parts[1]);

		if (!page) {
			throw error(404, 'Finner ikke siden');
		}

		return {
			title: page?.title || 'For studenter',
			content: await marked(page?.body || '')
		};
	}

	throw error(404, 'Finner ikke siden');
};
