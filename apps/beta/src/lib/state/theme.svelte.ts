import { browser } from '$app/environment';

export class ThemeState {
	current: 'light' | 'dark' = $state('light');

	constructor() {
		if (browser) {
			const html = document.querySelector('html');
			if (html) {
				if (html.classList.contains('dark')) {
					this.current = 'dark';
				} else {
					this.current = 'light';
				}
			}
		}
	}

	toggle = () => {
		const html = document.querySelector('html');
		if (html) {
			if (html.classList.contains('dark')) {
				html.classList.remove('dark');
				localStorage.setItem('theme', 'light');
				this.current = 'light';
			} else {
				html.classList.add('dark');
				localStorage.setItem('theme', 'dark');
				this.current = 'dark';
			}
		}
	};
}
