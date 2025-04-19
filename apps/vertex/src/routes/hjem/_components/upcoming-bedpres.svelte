<script lang="ts">
	import { urlFor } from '$lib/sanity/image';
	import { nb } from 'date-fns/locale';
	import type { PageData } from '../$types';
	import { format } from 'date-fns';
	import { capitalize } from '$lib/strings';

	type Props = {
		events: PageData['bedpres'];
	};

	let { events }: Props = $props();
</script>

<div>
	{#each events as event}
		<a
			href="/arrangement/{event.slug}"
			class="flex flex-col justify-center group gap-4 p-4 h-[100px] hover:bg-muted"
		>
			<div class="flex items-center gap-4">
				{#if event.image}
					<img
						src={urlFor(event.image).url()}
						alt={event.title}
						class="w-16 h-16 rounded-lg object-cover"
					/>
				{/if}

				<div>
					<h3 class="font-semibold group-hover:underline">{event.title}</h3>
					<p class="text-sm text-muted-foreground">
						{capitalize(format(event.date, 'eeee dd. MMM', { locale: nb }))}
						kl. {format(event.date, 'HH:mm')}
					</p>
				</div>
			</div>
		</a>
	{/each}
</div>
