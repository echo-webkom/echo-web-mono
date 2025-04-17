import { browser } from '$app/environment';

export class ThemeState {
	theme: 'light' | 'dark' = $state('light');

	constructor() {
		if (browser) {
			const html = document.querySelector('html');
			if (html) {
				if (html.classList.contains('dark')) {
					this.theme = 'dark';
				} else {
					this.theme = 'light';
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
				this.theme = 'light';
			} else {
				html.classList.add('dark');
				localStorage.setItem('theme', 'dark');
				this.theme = 'dark';
			}
		}
	};
}
