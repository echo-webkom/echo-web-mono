<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';

	let { data } = $props();
</script>

<Heading>{data.post.title}</Heading>

<div class="flex flex-col gap-3">
	<p class="text-lg font-bold">Publisert av:</p>
	<div class="flex flex-col flex-wrap gap-5 md:flex-row">
		<div class="flex items-center gap-3">
			<span class="relative flex shrink-0 overflow-hidden rounded-full border-2 h-12 w-12"
				><span class="flex h-full w-full items-center justify-center rounded-full bg-muted">JK</span
				></span
			>
			<p>Jesper Kierulf Hammer</p>
		</div>
	</div>
</div>

<Markdown markdown={data.post.body} />
