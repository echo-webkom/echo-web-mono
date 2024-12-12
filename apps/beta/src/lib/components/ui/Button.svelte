<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { VariantProps } from 'class-variance-authority';
	import { buttonVariants } from '$lib/variants/button';

	type Props = HTMLButtonAttributes & VariantProps<typeof buttonVariants>;

	let { class: className, variant, size, fullWidth, children, ...props }: Props = $props();
</script>

<button class={buttonVariants({ variant, size, fullWidth, className })} {...props}>
	{@render children?.()}
</button>
