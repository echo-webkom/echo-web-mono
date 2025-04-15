import { type Icon as IconType } from '@lucide/svelte';
import { setContext, getContext } from 'svelte';

const HEADER_CONTEXT_KEY = 'header-context';

export type HeaderContext = {
	openRoutes: {
		links: Array<{ label: string; description: string; href: string; icon: typeof IconType }>;
		label: string;
	} | null;
};

export const setHeaderContext = (context: HeaderContext) => {
	setContext(HEADER_CONTEXT_KEY, context);
};

export const getHeaderContext = () => {
	const context = getContext<HeaderContext>(HEADER_CONTEXT_KEY);
	if (!context) {
		throw new Error('Header context not found');
	}

	return context;
};
