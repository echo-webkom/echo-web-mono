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
			class="flex flex-col justify-center group hover:bg-muted gap-4 p-4 h-[75px] lg:h-[79px]"
		>
			<div class="flex items-center gap-4">
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
