<script lang="ts">
	import type { StaticInfoQueryResult } from '@echo-webkom/cms/types';
	import Heading from '$lib/components/ui/heading.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';

	type Props = {
		page: Awaited<StaticInfoQueryResult>[number];
	};

	let { page }: Props = $props();
</script>

<svelte:head>
	<title>{page.title}</title>
</svelte:head>

<Heading>{page.title}</Heading>
<Markdown markdown={page.body} />
