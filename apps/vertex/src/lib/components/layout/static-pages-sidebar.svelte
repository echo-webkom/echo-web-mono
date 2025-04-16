<script lang="ts">
	import { routes } from '$lib/routes';
	import { page } from '$app/state';
	import { cn } from '$lib/cn';

	const r = $derived.by(() => {
		return routes.find((r) => r.links[0].href.split('/')[1] === page.url.pathname.split('/')[1]);
	});
</script>

{#if r}
	<aside class="hidden w-full max-w-[200px] flex-shrink-0 flex-col md:flex">
		<h2 class="text-lg mb-4 font-semibold text-foreground">{r.label}</h2>

		<menu class="flex flex-col space-y-2">
			{#each r.links as link}
				<li>
					<a
						href={link.href}
						class={cn('text-muted-foreground hover:text-foreground', {
							'text-foreground': page.url.pathname === link.href
						})}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</menu>
	</aside>
{/if}
