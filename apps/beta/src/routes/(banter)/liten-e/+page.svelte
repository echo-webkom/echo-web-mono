<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>echo, ikke "Echo"</title>
</svelte:head>

<Container>
	<Markdown markdown={data.body} />
</Container>
