<script lang="ts">
	import { chipVariants, type ChipVariants } from '$lib/variants';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	type Props = HTMLAttributes<HTMLSpanElement> &
		ChipVariants & {
			as?: 'span' | 'div';
		};

	let { children, as = 'span', variant, size, class: className, ...props }: Props = $props();
</script>

<svelte:element this={as} class={twMerge(chipVariants({ variant, size, className }))} {...props}
	>{@render children?.()}</svelte:element
>
