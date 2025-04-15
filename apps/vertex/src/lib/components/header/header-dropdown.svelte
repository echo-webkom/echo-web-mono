<script lang="ts">
	import { getHeaderContext } from '$lib/context/header';

	let headerCtx = getHeaderContext();
</script>

{#if headerCtx.routes.length > 0}
	<nav class="absolute bg-background border-b w-full flex">
		<menu class="gap-4 grid grid-cols-3 mx-auto max-w-7xl p-4">
			{#each headerCtx.routes as route}
				{@const Icon = route.icon}
				<li>
					<a
						class="p-4 rounded-xl flex border-2 border-transparent hover:border-border hover:bg-muted items-center h-24 gap-8"
						href={route.href}
					>
						<div class="shrink-0">
							<Icon />
						</div>
						<div class="flex flex-col gap-1">
							<span class="font-medium">{route.label}</span>
							<span class="text-muted-foreground">{route.description}</span>
						</div>
					</a>
				</li>
			{/each}
		</menu>
	</nav>
{/if}
