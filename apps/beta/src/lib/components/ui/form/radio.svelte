<script lang="ts">
	import { cn } from '$lib/cn';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'type'>;

	let { class: className, ...props }: Props = $props();
</script>

<input
	type="radio"
	class={cn(
		'appearance-none',
		'h-4 w-4 rounded-full',
		'border-2 border-gray-400 bg-white',
		'checked:bg-primary checked:border-primary',
		'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
		'transition duration-200 ease-in-out',
		className
	)}
	{...props}
/>
