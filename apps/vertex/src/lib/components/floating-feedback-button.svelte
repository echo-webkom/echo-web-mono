<script lang="ts">
	import { MessageCircle } from '@lucide/svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Tooltip from '$lib/components/ui/tooltip.svelte';
</script>

<div class="fixed bottom-0 right-0 z-30 m-5">
	<Tooltip>
		{#snippet trigger()}
			<Button class="p-1 size-12" href="/tilbakemelding">
				<MessageCircle class="size-6 text-white" />
			</Button>
		{/snippet}

		Send tilbakemelding
	</Tooltip>
</div>
