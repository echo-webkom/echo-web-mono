<script lang="ts">
	import { cn } from '$lib/cn';
	import { getHeaderContext } from '$lib/context/header';
	import { ChevronDown, type Icon as IconType } from '@lucide/svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		label: string;
		links: Array<{
			label: string;
			description: string;
			href: string;
			icon: typeof IconType;
		}>;
	};

	let { label, links, class: className, ...props }: Props = $props();

	let headerCtx = getHeaderContext();

	let isOpen = $derived(headerCtx.openRoutes?.label === label);

	const handleClick = () => {
		if (isOpen) {
			headerCtx.openRoutes = null;
		} else {
			headerCtx.openRoutes = {
				links,
				label
			};
		}
	};
</script>

<li>
	<button
		onclick={handleClick}
		class={[
			'font-medium flex h-10 p-2 hover:bg-muted rounded-xl dark:text-foreground text-gray-600 items-center gap-2',
			className
		]}
		{...props}
		>{label}
		<ChevronDown class={cn('size-4', isOpen ? 'rotate-180' : 'rotate-0')} /></button
	>
</li>
