<script lang="ts">
	import Avatar from '$lib/components/ui/avatar.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';
	import { urlFor } from '$lib/sanity/image.js';
	import { initials } from '$lib/strings';

	let { data } = $props();
</script>

<Heading>{data.post.title}</Heading>

{#if data.post.authors}
	<div class="mb-8 flex flex-col gap-3">
		<p class="text-lg font-bold">Publisert av:</p>
		<div class="flex flex-col flex-wrap gap-5 md:flex-row">
			{#each data.post.authors as author}
				<div class="flex items-center gap-3">
					<Avatar
						alt={author.name}
						src={urlFor(author.image ?? '').url()}
						class="h-12 w-12 shrink-0"
						fallback={initials(author.name)}
					/>
					<p>{author.name}</p>
				</div>
			{/each}
		</div>
	</div>
{/if}

<Markdown markdown={data.post.body} />
