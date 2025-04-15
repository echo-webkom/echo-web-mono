<script lang="ts">
	import StaticPage from '$lib/components/static-page.svelte';

	let { data } = $props();
</script>

<StaticPage page={data.page} />
