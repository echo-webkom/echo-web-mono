import { marked } from 'marked';
import type { PageServerLoad } from './$types';

const fetchGuidelines = async () => {
	return await fetch(
		'https://raw.githubusercontent.com/echo-uib/Retningslinjer/main/Etiske_retningslinjer.md'
	).then((res) => res.text());
};

export const load: PageServerLoad = async () => {
	const bylaws = await fetchGuidelines();
	const body = await marked(bylaws);

	return {
		body
	};
};
