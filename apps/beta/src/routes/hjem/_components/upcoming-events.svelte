<script lang="ts">
	import { capitalize } from '$lib/strings';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale';
	import type { PageData } from '../$types';
	import { page } from '$app/state';

	let data = $derived(page.data as PageData);
	let events = $derived(data.events);
</script>

<div>
	{#each events as event}
		<a
			href="/arrangement/{event.slug}"
			class="group hover:bg-muted flex h-[75px] flex-col justify-center gap-4 p-4 lg:h-[79px]"
		>
			<div class="flex items-center gap-4">
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
	{/each}
</div>
