<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';

	let { data } = $props();
</script>

<Heading>Vedtekter</Heading>
<Markdown markdown={data.body} />
