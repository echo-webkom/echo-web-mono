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
			'font-medium hover:underline rounded-xl dark:text-foreground hover:bg-muted p-2 h-10 text-gray-600',
			className
		]}
		{...props}>{@render children()}</a
	>
</li>
