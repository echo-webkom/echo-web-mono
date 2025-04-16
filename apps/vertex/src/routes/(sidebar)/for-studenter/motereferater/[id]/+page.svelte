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
			class="inline-flex items-center font-semibold justify-center rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background duration-300 bg-primary border-primary-dark text-primary-foreground hover:bg-primary-hover h-10 py-2 px-4 w-full md:w-fit"
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
