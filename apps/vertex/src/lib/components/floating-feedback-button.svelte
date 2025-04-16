<script lang="ts">
	import { MessageCircle } from '@lucide/svelte';
</script>

<button
	class="inline-flex items-center font-semibold justify-center border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background duration-300 bg-primary border-primary-dark text-primary-foreground hover:bg-primary-hover h-12 w-12 fixed bottom-0 right-0 z-30 m-5 rounded-full"
	type="button"
>
	<a data-testid="feedback-button" href="/tilbakemelding">
		<MessageCircle class="size-6 text-white" />
	</a>
</button>
