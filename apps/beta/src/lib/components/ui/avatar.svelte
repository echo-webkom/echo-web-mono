<script lang="ts">
	import { Avatar, type WithoutChildrenOrChild } from 'bits-ui';
	import { cn } from '$lib/cn';

	let {
		src,
		alt,
		fallback,
		class: className,
		ref = $bindable(null),
		imageRef = $bindable(null),
		fallbackRef = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Avatar.RootProps> & {
		src: string;
		alt: string;
		fallback: string;
		imageRef?: HTMLImageElement | null;
		fallbackRef?: HTMLElement | null;
	} = $props();
</script>

<Avatar.Root
	class={cn(
		'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-sm',
		className
	)}
	{...restProps}
	bind:ref
>
	<Avatar.Image {src} {alt} bind:ref={imageRef} />
	<Avatar.Fallback bind:ref={fallbackRef}>
		{fallback}
	</Avatar.Fallback>
</Avatar.Root>
