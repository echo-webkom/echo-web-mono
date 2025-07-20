<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement>;

	let { children, class: className, ...props }: Props = $props();
</script>

<div
	class={cn(
		'mx-auto flex w-full max-w-[1200px] flex-row gap-4 px-4 py-10 sm:px-6 lg:px-8',
		className
	)}
	{...props}
>
	{@render children?.()}
</div>
