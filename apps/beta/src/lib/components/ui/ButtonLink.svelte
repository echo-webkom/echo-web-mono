<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { VariantProps } from 'class-variance-authority';
	import { buttonVariants } from '$lib/variants/button';

	type Props = HTMLAnchorAttributes & VariantProps<typeof buttonVariants>;

	let { class: className, variant, size, fullWidth, children, ...props }: Props = $props();
</script>

<a class={buttonVariants({ variant, size, fullWidth, className })} {...props}>
	{@render children?.()}
</a>
