<script lang="ts">
	import { cn } from '$lib/cn';
	import { getHeaderContext } from '$lib/context/header';
	import type { Snippet } from 'svelte';
	import { ChevronDown, type Icon as IconType } from '@lucide/svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		links: Array<{
			label: string;
			description: string;
			href: string;
			icon: typeof IconType;
		}>;
		children: Snippet;
	};

	let { children, links, class: className, ...props }: Props = $props();

	let isOpen = $state(false);
	let headerCtx = getHeaderContext();

	const handleClick = () => {
		isOpen = !isOpen;

		if (isOpen) {
			headerCtx.routes = links;
		} else {
			headerCtx.routes = [];
		}
	};
</script>

<li>
	<button
		onclick={handleClick}
		class={[
			'font-medium flex h-10 p-2 hover:bg-muted text-muted-foreground items-center gap-2',
			className
		]}
		{...props}
		>{@render children()}
		<ChevronDown class={cn('size-4', isOpen ? 'rotate-180' : 'rotate-0')} /></button
	>
</li>
