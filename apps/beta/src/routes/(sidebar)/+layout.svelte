<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import StaticPagesSidebar from '$lib/components/layout/static-pages-sidebar.svelte';

	let { children } = $props();
</script>

<Container class="max-w-[1400px]">
	<StaticPagesSidebar />

	<div class="h-full w-full">
		{@render children()}
	</div>
</Container>
