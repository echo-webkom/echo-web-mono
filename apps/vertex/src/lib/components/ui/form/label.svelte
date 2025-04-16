<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes & {
		required?: boolean;
	};

	let { children, class: className, required, ...props }: Props = $props();
</script>

<label
	class={[
		'text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	]}
	{...props}
>
	{@render children?.()}
	{#if required}
		<span class="text-red-500 text-sm" aria-hidden="true">*</span>
	{/if}
</label>
