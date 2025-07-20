<script lang="ts">
	import { cn } from '$lib/cn';
	import { Dialog } from 'bits-ui';

	type Props = Dialog.DescriptionProps;

	let { children, class: className, ...props }: Props = $props();
</script>

<Dialog.Description class={cn(className)} {...props}>
	{@render children?.()}
</Dialog.Description>
