<script lang="ts">
	import { urlFor } from '$lib/sanity/image';
	import { nb } from 'date-fns/locale';
	import type { PageData } from '../$types';
	import { format } from 'date-fns';
	import { capitalize } from '$lib/strings';
	import { page } from '$app/state';

	let data = $derived(page.data as PageData);
	let events = $derived(data.bedpres);
</script>

<div class="flex h-full flex-col">
	{#each events as event}
		<a
			href="/arrangement/{event.slug}"
			class="group hover:bg-muted flex h-[100px] flex-col justify-center gap-4 p-4"
		>
			<div class="flex items-center gap-4">
				{#if event.image}
					<img
						src={urlFor(event.image).url()}
						alt={event.title}
						class="h-16 w-16 rounded-lg object-cover"
					/>
				{/if}

				<div>
					<h3 class="line-clamp-1 font-semibold text-ellipsis group-hover:underline">
						{event.title}
					</h3>
					<p class="text-muted-foreground text-xs">
						{capitalize(format(event.date, 'eeee dd. MMM', { locale: nb }))}
						kl. {format(event.date, 'HH:mm')}
					</p>
				</div>
			</div>
		</a>
	{:else}
		<div class="flex flex-col items-center justify-center h-full p-4">
			<p class="text-muted-foreground text-lg font-medium text-center">
				Bedpres szn er over. Kom tilbake neste semester.
			</p>
		</div>
	{/each}
</div>
