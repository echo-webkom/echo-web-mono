<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';

	let { data } = $props();
</script>

<ul class="grid grid-cols-1 gap-2 py-8 lg:grid-cols-2">
	{#each data.groups as group}
		<li>
			<a href="/for-studenter/gruppe/{group.slug}">
				<div
					class="hover:bg-muted group flex h-full flex-col gap-3 rounded-lg border-2 p-6 shadow-lg"
				>
					<h2 class="text-2xl font-bold">{group.name}</h2>

					{#if group.description}
						<p class="dark:text-foreground line-clamp-3 flex-1 text-slate-700">
							{group.description}
						</p>
					{/if}

					<p class="flex items-center gap-1 font-medium">
						Les mer
						<span class="transition-all duration-150 group-hover:pl-1">
							<ArrowRight />
						</span>
					</p>
				</div>
			</a>
		</li>
	{/each}
</ul>
