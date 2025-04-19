<script lang="ts">
	import { textVariants, type TextVariants } from '$lib/variants';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	type Props = HTMLAttributes<HTMLParagraphElement> & TextVariants;

	let { children, size, intent, class: className, ...props }: Props = $props();
</script>

<p class={twMerge(textVariants({ size, intent, class: className }))} {...props}>
	{@render children?.()}
</p>
