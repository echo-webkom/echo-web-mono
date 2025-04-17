<script lang="ts">
	import { getThemeContext } from '$lib/context/color-theme';
	import { Moon, Sun } from '@lucide/svelte';

	const theme = getThemeContext();
</script>

<button onclick={theme.state.toggle}>
	<span class="sr-only">Toggle dark mode</span>
	<Sun class="hidden dark:block size-6" />
	<Moon class="block dark:hidden size-6" />
	<span class="sr-only">Toggle light mode</span>
</button>
