<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		children: Snippet;
	};

	let { children, class: className, ...props }: Props = $props();
</script>

<li>
	<a
		class={[
			'dark:text-foreground hover:bg-muted h-10 rounded-xl p-2 font-medium text-gray-600 hover:underline',
			className
		]}
		{...props}>{@render children()}</a
	>
</li>
