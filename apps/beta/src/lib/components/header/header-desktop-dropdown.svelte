<script lang="ts">
	import { getHeaderContext } from '$lib/context/header';
	import { slide } from 'svelte/transition';

	let headerCtx = getHeaderContext();
</script>

{#if !!headerCtx.openRoutes?.label}
	<nav transition:slide class="bg-background absolute flex w-full border-b">
		<menu class="mx-auto grid max-w-7xl grid-cols-2 gap-4 p-4 lg:grid-cols-3">
			{#each headerCtx.openRoutes!.links as route}
				{@const Icon = route.icon}
				<li>
					<a
						class="hover:border-border hover:bg-muted flex h-24 items-center gap-8 rounded-xl border-2 border-transparent p-4"
						href={route.href}
					>
						<div class="shrink-0">
							<Icon />
						</div>
						<div class="flex flex-col gap-1">
							<span class="font-medium">{route.label}</span>
							<span class="text-muted-foreground text-sm">{route.description}</span>
						</div>
					</a>
				</li>
			{/each}
		</menu>
	</nav>
{/if}
