<script lang="ts">
	import StaticPagesSiderbar from '$lib/components/static-pages-siderbar.svelte';
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';

	let { data } = $props();
</script>

<Container>
	<StaticPagesSiderbar />

	<div>
		<Heading>Vedtekter</Heading>
		<Markdown markdown={data.body} />
	</div>
</Container>
