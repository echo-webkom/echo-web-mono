<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';

	const toggleTheme = () => {
		const html = document.querySelector('html');
		if (html) {
			if (html.classList.contains('dark')) {
				html.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			} else {
				html.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			}
		}
	};
</script>

<button onclick={toggleTheme}>
	<span class="sr-only">Toggle dark mode</span>
	<Sun class="hidden dark:block size-6" />
	<Moon class="block dark:hidden size-6" />
	<span class="sr-only">Toggle light mode</span>
</button>
