<script lang="ts">
	import StaticPage from '$lib/components/layout/static-page.svelte';
	import GroupOverviewPage from '$lib/components/layout/group-overview-page.svelte';

	let { data } = $props();
</script>

{#if data.isGroupPage}
	<GroupOverviewPage groups={data.groups} />
{:else}
	<StaticPage page={data.page!} />
{/if}
