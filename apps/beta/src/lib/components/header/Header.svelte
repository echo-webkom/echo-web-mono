<script lang="ts">
	import { getUser } from '$lib/context/user.context';
	import { ChevronDown, Menu } from 'lucide-svelte';
	import HeaderLogo from './HeaderLogo.svelte';
	import { headerRoutes } from '$lib/routes';
	import { cn } from '$lib/cn';
	import SignInButton from './SignInButton.svelte';
	import SignOutButton from './SignOutButton.svelte';
	import UserMenu from './UserMenu.svelte';
	import { onNavigate } from '$app/navigation';

	let user = getUser();
	let openRoute = $state<string | null>(null);
	let dropdown = $derived(
		headerRoutes.filter((route) => 'links' in route).find((route) => route.label === openRoute)
	);

	onNavigate(() => {
		openRoute = null;
	});

	const toggleRoute = (route: string) => {
		if (openRoute === route) {
			openRoute = null;
		} else {
			openRoute = route;
		}
	};
</script>

<div class="sticky top-0 z-20">
	<div class="bg-background border-b-2">
		<header class="bg-background mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
			<div class="flex items-center gap-4">
				<HeaderLogo />

				<div class="mt-auto hidden items-center pb-2 md:flex">
					{#each headerRoutes as route}
						{#if 'links' in route}
							<button
								onclick={() => toggleRoute(route.label)}
								class="hover:bg-muted dark:text-foreground flex h-10 flex-row items-center gap-1 rounded-xl p-2 font-semibold text-gray-600"
								>{route.label}

								<ChevronDown
									class={cn('size-4 transition-transform', {
										'rotate-180': openRoute === route.label
									})}
								/>
							</button>
						{:else}
							<a
								href={route.href}
								class="hover:bg-muted dark:text-foreground flex h-10 flex-row items-center gap-1 rounded-xl p-2 font-semibold text-gray-600"
								>{route.label}</a
							>
						{/if}
					{/each}
				</div>
			</div>

			<div class="flex items-center gap-4">
				{#if $user}
					<UserMenu />
					<SignOutButton />
				{:else}
					<SignInButton />
				{/if}
				<button class="block md:hidden">
					<Menu class="size-6" />
				</button>
			</div>
		</header>
	</div>

	{#if dropdown?.label}
		<div class="bg-background absolute left-0 z-20 w-full overflow-hidden border-b-2">
			<ul class="mx-auto hidden max-w-6xl grid-cols-2 gap-2 px-4 py-6 md:grid lg:grid-cols-3">
				{#each dropdown.links as route}
					<a
						class="hover:border-border hover:bg-muted flex items-center rounded-xl border-2 border-transparent p-4"
						href={route.href}
					>
						<div class="flex items-center gap-6">
							{#if route.Icon}
								<route.Icon class="size-6 flex-shrink-0" />
							{/if}
							<div>
								<p class="font-semibold">{route.label}</p>
								<p class="text-muted-foreground text-sm font-medium">{route.description}</p>
							</div>
						</div>
					</a>
				{/each}
			</ul>
		</div>
	{/if}
</div>
