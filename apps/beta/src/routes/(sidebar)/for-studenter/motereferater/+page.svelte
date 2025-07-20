<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale';

	let { data } = $props();
</script>

<ul class="divide-y overflow-hidden rounded-lg border">
	{#each data.minutes as minute}
		{@const type = minute.isAllMeeting ? 'Generalforsamling' : 'Møte'}
		<li>
			<a href="/for-studenter/motereferater/{minute._id}"
				><div
					class="group hover:bg-muted flex w-full items-center justify-between px-5 py-5 transition-all hover:py-10"
				>
					<div class="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
						<p class="py-1 text-xl break-words">{type}</p>
						<div class="flex items-center gap-2">
							<p>{format(minute.date, 'dd. eee. yyyy', { locale: nb })}</p>

							<ArrowRight class="hidden size-8 rounded border p-2 sm:block" />
						</div>
					</div>

					<div class="block sm:hidden">
						<ArrowRight class="size-10 rounded border p-2" />
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
