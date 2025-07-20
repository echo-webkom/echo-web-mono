<script lang="ts">
	import { MessageCircle } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Tooltip from '$lib/components/ui/tooltip.svelte';
</script>

<div class="fixed right-0 bottom-0 z-30 m-5">
	<Tooltip>
		{#snippet trigger()}
			<Button class="size-12 p-1" href="/tilbakemelding">
				<MessageCircle class="size-6 text-white" />
			</Button>
		{/snippet}

		Send tilbakemelding
	</Tooltip>
</div>
