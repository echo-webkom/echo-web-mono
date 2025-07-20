<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/cn';

	type Props = HTMLLabelAttributes & {
		required?: boolean;
	};

	let { children, class: className, required, ...props }: Props = $props();
</script>

<label
	class={cn(
		'text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...props}
>
	{@render children?.()}
	{#if required}
		<span class="text-sm text-red-500" aria-hidden="true">*</span>
	{/if}
</label>
