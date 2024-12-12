<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';

	let { data } = $props();
</script>

<h1 class="mb-4 text-2xl font-medium">Møtereferater</h1>
<ul class="divide-y overflow-hidden rounded-xl border">
	{#each data.minutes as minute}
		<li>
			<a href="/for-studenter/motereferat/{minute._id}">
				<div
					class="hover:bg-muted group flex items-center justify-between px-5 py-5 transition-all hover:py-10"
				>
					<div class="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
						<p class="text-xl">
							{#if minute.isAllMeeting}
								Generalforsamling
							{:else}
								Møte
							{/if}
						</p>

						<div class="flex items-center gap-2">
							<p>
								{new Date(minute.date).toLocaleDateString('nb-NO', {
									day: 'numeric',
									month: 'short',
									year: 'numeric',
									timeZone: 'Europe/Oslo'
								})}
							</p>
							<ArrowRight class="hidden h-8 w-8 rounded border p-2 sm:block" />
						</div>
					</div>

					<div class="block sm:hidden">
						<ArrowRight class="h-8 w-8 rounded border p-2" />
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
