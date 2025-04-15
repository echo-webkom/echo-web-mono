<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLElement> & {
		markdown?: string;
		children?: string;
	};

	let { children, markdown, class: className, ...props }: Props = $props();
</script>

<article class={cn('prose md:prose-lg prose-h1:text-4xl dark:prose-invert', className)} {...props}>
	{@html children || markdown}
</article>
