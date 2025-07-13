<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLElement> & {
		markdown: string;
	};

	let { markdown, class: className, ...props }: Props = $props();
</script>

<article
	class={cn(
		'prose md:prose-lg prose-h1:text-4xl dark:prose-invert prose-a:text-primary',
		className
	)}
	{...props}
>
	<!-- eslint-disable svelte/no-at-html-tags -->
	{@html markdown}
</article>
