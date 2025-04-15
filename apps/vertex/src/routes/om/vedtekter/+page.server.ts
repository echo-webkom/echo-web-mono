import { marked } from 'marked';
import type { PageServerLoad } from './$types';

const fetchBylaws = async () => {
	return await fetch('https://raw.githubusercontent.com/echo-uib/Vedtekter/main/vedtekter.md').then(
		(res) => res.text()
	);
};

export const prerender = true;

export const load: PageServerLoad = async () => {
	const bylaws = await fetchBylaws();
	const body = await marked(bylaws);

	return {
		body
	};
};
