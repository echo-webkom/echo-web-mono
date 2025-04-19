<script lang="ts">
	import { headingVariants, type HeadingVariants } from '$lib/variants';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	type Props = HTMLAttributes<HTMLHeadingElement> &
		HeadingVariants & {
			as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		};

	let { children, as = 'h1', size, class: className, ...props }: Props = $props();
</script>

<svelte:element this={as} class={twMerge(headingVariants({ size, class: className }))} {...props}>
	{@render children?.()}
</svelte:element>
