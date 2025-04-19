<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';

	let { data } = $props();
</script>

<Container>
	<div class="border-2 rounded-2xl flex md:max-w-10 w-full h-500"></div>

	<div>
		<Heading>{data.event.title}</Heading>
	</div>
</Container>
