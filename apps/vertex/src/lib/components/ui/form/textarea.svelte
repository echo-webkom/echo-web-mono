<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = HTMLTextareaAttributes;

	let { value = $bindable(), class: className, ...props }: Props = $props();
</script>

<textarea
	bind:value
	class={[
		'flex h-20 w-full rounded-md border-2 border-border bg-input px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	]}
	{...props}
></textarea>
