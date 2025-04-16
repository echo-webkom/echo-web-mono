<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import { urlFor } from '$lib/sanity/image';
	import { ArrowRight } from '@lucide/svelte';

	let { data } = $props();
</script>

<Heading>Merch</Heading>

<ul class="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
	{#each data.merch as item}
		<li>
			<a href="/for-studenter/merch/{item.slug}"
				><div
					class="group flex h-full justify-between gap-3 rounded-lg border-2 p-6 shadow-lg hover:bg-muted"
				>
					<div class="flex flex-col gap-3">
						<h2 class="text-2xl font-bold">{item.title}</h2>
						<p class="flex items-center gap-1 font-medium">
							Les mer<span class="transition-all duration-150 group-hover:pl-1">
								<ArrowRight />
							</span>
						</p>
					</div>
					<div>
						<img
							alt={item.title}
							class="rounded-lg"
							src={urlFor(item.image).width(200).height(200).url()}
						/>
					</div>
				</div></a
			>
		</li>
	{/each}
</ul>
