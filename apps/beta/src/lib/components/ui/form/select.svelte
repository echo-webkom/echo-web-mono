<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Props = HTMLSelectAttributes;

	let { value = $bindable(), children, class: className, ...props }: Props = $props();
</script>

<select
	bind:value
	class={[
		'border-border bg-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border-2 px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	]}
	{...props}
>
	{@render children?.()}
</select>
