<script lang="ts">
	import { cn } from '$lib/cn';
	import { Dialog } from 'bits-ui';

	type Props = Dialog.TitleProps;

	let { children, class: className, ...props }: Props = $props();
</script>

<Dialog.Title class={cn('text-xl font-bold', className)} {...props}>
	{@render children?.()}
</Dialog.Title>
