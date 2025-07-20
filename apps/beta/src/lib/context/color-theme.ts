import type { ThemeState } from '$lib/state/theme.svelte';
import { setContext, getContext } from 'svelte';

const THEME_CONTEXT_KEY = Symbol('color-theme');

export const setThemeContext = (ctx: ThemeState) => {
	setContext(THEME_CONTEXT_KEY, ctx);
};

export const getThemeContext = () => {
	const ctx = getContext<ThemeState>(THEME_CONTEXT_KEY);
	if (!ctx) {
		throw new Error('No theme context found');
	}
	return ctx;
};
