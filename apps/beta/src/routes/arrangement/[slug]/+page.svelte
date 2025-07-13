<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';
	import Sidebar from './_components/sidebar.svelte';

	let { data } = $props();
</script>

<Container class="flex flex-col gap-16 md:flex-row md:gap-4">
	<Sidebar />

	<div class="flex-1">
		<Heading>{data.event.title}</Heading>

		{#if data.event.body}
			<Markdown markdown={data.event.body} />
		{:else}
			<p class="text-muted-foreground">Arrangementet har ikke lagt ut noe informasjon enda.</p>
		{/if}
	</div>
</Container>
