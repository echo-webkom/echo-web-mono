<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale';
	import removeMd from 'remove-markdown';

	let { data } = $props();
</script>

<Heading>Innlegg</Heading>

<div class="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
	{#each data.posts as post}
		<div>
			<a href="/for-studenter/innlegg/{post.slug}"
				><div
					class="h-42 relative flex flex-col gap-1 rounded-xl border-2 p-6 transition-colors duration-200 ease-in-out hover:border-muted-dark hover:bg-muted"
				>
					<h3 class="line-clamp-2 flex gap-2 text-xl font-semibold">{post.title}</h3>
					<p class="right-2 top-2 text-sm text-gray-500 sm:absolute">
						{format(post._createdAt, 'd. MMM', { locale: nb })}
					</p>
					<p class="my-2 line-clamp-3 text-sm italic">
						{removeMd(post.body)}
					</p>

					{#if post.authors?.length ?? 0 > 0}
						<div
							class="flex flex-row flex-wrap items-center gap-1 sm:absolute sm:-bottom-4 sm:right-4"
						>
							{#each post.authors! as author}
								<span
									class="inline-block rounded-full border-2 px-3 py-1 text-xs font-semibold border-secondary-dark bg-secondary text-secondary-foreground"
									>{author.name}</span
								>
							{/each}
						</div>
					{/if}
				</div></a
			>
		</div>
	{/each}
</div>
