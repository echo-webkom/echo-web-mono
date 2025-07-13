<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';

	let { data } = $props();

	let title = $derived(data.minute.isAllMeeting ? 'Generalforsamling' : 'Møte');
</script>

<Heading>{title}</Heading>

{#if data.minute.document}
	<div class="flex flex-col gap-5">
		<a
			href={data.minute.document}
			class="focus-visible:ring-ring ring-offset-background bg-primary border-primary-dark text-primary-foreground hover:bg-primary-hover inline-flex h-10 w-full items-center justify-center rounded-xl border-2 px-4 py-2 font-semibold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:w-fit"
			type="button"
		>
			Last ned
		</a>

		<iframe
			title="{title} {new Date(data.minute.date).toLocaleDateString()}"
			src={data.minute.document}
			class="h-screen w-full"
		></iframe>
	</div>
{:else}
	<p class="text-center text-xl">Ingen dokumenter tilgjengelig</p>
{/if}
