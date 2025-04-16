<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import { Heart } from '@lucide/svelte';

	let { data } = $props();
</script>

<Heading>Hyggkoms handleliste</Heading>

<ul class="rounded-s border capitalize">
	{#each data.items as item}
		<li class="flex justify-between px-6 py-1 bg-muted rounded-b-md">
			<div class="flex flex-col">
				<p class="break-words py-1 text-lg pb-0 pt-2">Avløpsfilter til vask på Beta</p>
			</div>
			<div class="flex items-center justify-end gap-4">
				<div class="flex items-center gap-4">
					<p class="break-words py-1 text-lg">2</p>
					<button class="h-min rounded-md p-3 hover:bg-reaction dark:hover:bg-gray-600">
						<Heart />
					</button>
				</div>
			</div>
		</li>
	{/each}
</ul>
