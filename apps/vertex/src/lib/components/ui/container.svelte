<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement>;

	let { children, class: className, ...props }: Props = $props();
</script>

<div
	class={cn(
		'mx-auto w-full px-4 sm:px-6 lg:px-8 gap-4 max-w-[1200px] flex flex-row py-10',
		className
	)}
	{...props}
>
	{@render children?.()}
</div>
