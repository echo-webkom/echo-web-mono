import { type Icon as IconType } from '@lucide/svelte';
import { setContext, getContext } from 'svelte';

const HEADER_CONTEXT_KEY = Symbol('header-context');

export type HeaderContext = {
	openRoutes: {
		links: Array<{ label: string; description: string; href: string; icon: typeof IconType }>;
		label: string;
	} | null;
};

export const setHeaderContext = (ctx: HeaderContext) => {
	setContext(HEADER_CONTEXT_KEY, ctx);
};

export const getHeaderContext = () => {
	const ctx = getContext<HeaderContext>(HEADER_CONTEXT_KEY);
	if (!ctx) {
		throw new Error('Header context not found');
	}

	return ctx;
};
