<script lang="ts">
	import type { StudentGroupsByTypeQueryResult } from '@echo-webkom/cms/types';
	import Heading from '../ui/heading.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import removeMd from 'remove-markdown';
	import { GROUP_TYPE_TO_PATH, GROUP_TYPES } from '@echo-webkom/lib';

	type Props = {
		groups: StudentGroupsByTypeQueryResult;
	};

	let { groups }: Props = $props();

	let title = $derived(GROUP_TYPES.find((group) => group.value === groups[0].groupType)?.title);
</script>

<Heading>{title}</Heading>

<ul class="grid grid-cols-1 gap-2 lg:grid-cols-2">
	{#each groups as group}
		{@const typePath = GROUP_TYPE_TO_PATH[group.groupType]}
		<li>
			<a href="/for-studenter/{typePath}/{group.slug}">
				<div
					class="group flex h-full flex-col gap-3 rounded-lg border-2 p-6 shadow-lg hover:bg-muted"
				>
					<h2 class="text-2xl font-bold">{group.name}</h2>
					{#if group.description}
						<p class="line-clamp-3 flex-1 text-slate-700 dark:text-foreground">
							{removeMd(group.description)}
						</p>
					{/if}
					<p class="flex items-center gap-1 font-medium">
						Les mer
						<span class="transition-all duration-150 group-hover:pl-1">
							<ArrowRight class="h-4 w-4" />
						</span>
					</p>
				</div>
			</a>
		</li>
	{/each}
</ul>
