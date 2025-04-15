<script lang="ts">
	import StaticPagesSiderbar from '$lib/components/static-pages-siderbar.svelte';
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
</script>

<Container>
	<StaticPagesSiderbar />

	<div class="w-full">
		<Heading>Brosjyre</Heading>
		<iframe title="echo-brosjyre" style="width: 100%; height: 800px;" src="/echo-oppslag.pdf"
		></iframe>
	</div>
</Container>
