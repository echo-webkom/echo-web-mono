<script lang="ts">
	import { Dialog } from 'bits-ui';
	import DialogOverlay from './dialog-overlay.svelte';

	type Props = Dialog.RootProps;

	let { open = $bindable(false), children, ...props }: Props = $props();
</script>

<Dialog.Root bind:open {...props}>
	<Dialog.Portal>
		<DialogOverlay />
		{@render children?.()}
	</Dialog.Portal>
</Dialog.Root>
