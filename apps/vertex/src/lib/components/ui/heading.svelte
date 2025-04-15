<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLHeadingElement>;

	let { children, class: className, ...props }: Props = $props();
</script>

<h1
	class={cn('group flex items-center font-semibold tracking-tight text-4xl mb-4', className)}
	{...props}
>
	{@render children?.()}
</h1>
