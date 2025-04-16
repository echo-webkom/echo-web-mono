<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Props = HTMLSelectAttributes;

	let { value = $bindable(), children, class: className, ...props }: Props = $props();
</script>

<select
	bind:value
	class={[
		'flex h-10 w-full items-center justify-between rounded-md border-2 border-border bg-input px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground',
		className
	]}
	{...props}
>
	{@render children?.()}
</select>
