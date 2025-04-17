import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

export const getCurrentTheme = (): Theme => {
	if (!browser) {
		return 'light';
	}

	const hasDark = document.documentElement.classList.contains('dark');
	return hasDark ? 'dark' : 'light';
};
