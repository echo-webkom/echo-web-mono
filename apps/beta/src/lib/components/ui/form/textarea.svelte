<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = HTMLTextareaAttributes;

	let { value = $bindable(), class: className, ...props }: Props = $props();
</script>

<textarea
	bind:value
	class={[
		'border-border bg-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-24 w-full rounded-md border-2 px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	]}
	{...props}
>
</textarea>
