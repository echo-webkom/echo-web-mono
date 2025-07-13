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
			'hover:bg-muted dark:text-foreground flex h-10 items-center gap-2 rounded-xl p-2 font-medium text-gray-600',
			className
		]}
		{...props}
		>{label}
		<ChevronDown class={cn('size-4', isOpen ? 'rotate-180' : 'rotate-0')} /></button
	>
</li>
