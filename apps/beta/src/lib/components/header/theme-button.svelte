<script lang="ts">
	import { getThemeContext } from '$lib/context/color-theme';
	import { Moon, Sun } from '@lucide/svelte';

	const theme = getThemeContext();
</script>

<button onclick={theme.toggle}>
	<span class="sr-only">Toggle dark mode</span>
	<Sun class="hidden size-6 dark:block" />
	<Moon class="block size-6 dark:hidden" />
	<span class="sr-only">Toggle light mode</span>
</button>
