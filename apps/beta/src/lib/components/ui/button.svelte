<script lang="ts">
	import { Button } from 'bits-ui';
	import { buttonVariants, type ButtonVariants } from '$lib/variants';
	import { twMerge } from 'tailwind-merge';

	type Props = Button.RootProps & ButtonVariants;

	let { children, variant, size, loading, class: className, ...props }: Props = $props();
</script>

<Button.Root class={twMerge(buttonVariants({ variant, size, loading, className }))} {...props}>
	{@render children?.()}
</Button.Root>
