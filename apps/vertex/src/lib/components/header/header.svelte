<script lang="ts">
	import Logo from '$lib/assets/images/echo-logo.png';
	import { setHeaderContext } from '$lib/context/header';
	import HeaderButton from './header-button.svelte';
	import HeaderLink from './header-link.svelte';
	import HeaderDesktopDropdown from './header-desktop-dropdown.svelte';

	import ThemeButton from './theme-button.svelte';
	import { routes } from '$lib/routes';
	import { browser } from '$app/environment';
	import { ChevronDown, Menu, X } from '@lucide/svelte';
	import { cn } from '$lib/cn';
	import { slide } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';

	let isMobileDropdownOpen = $state(false);
	let activeMobileLabel = $state<string | null>(null);
	let innerWidth = $state(browser ? window.innerWidth : 0);
	let context = $state({
		openRoutes: null
	});
	setHeaderContext(context);

	const toggleMenu = () => {
		if (innerWidth < 1024) {
			isMobileDropdownOpen = !isMobileDropdownOpen;
		}
	};

	const toggleLabel = (label: string) => {
		if (activeMobileLabel === label) {
			activeMobileLabel = null;
		} else {
			activeMobileLabel = label;
		}
	};

	$effect(() => {
		if (isMobileDropdownOpen) {
			window.document.body.style.overflow = 'hidden';
		} else {
			window.document.body.style.overflow = 'auto';
		}
	});

	$effect(() => {
		if (innerWidth < 1024) {
			context.openRoutes = null;
		}

		if (innerWidth >= 1024) {
			isMobileDropdownOpen = false;
			activeMobileLabel = null;
		}
	});

	onNavigate(() => {
		isMobileDropdownOpen = false;
		activeMobileLabel = null;
		context.openRoutes = null;
	});
</script>

<svelte:window onresize={() => (innerWidth = window.innerWidth)} />

<div
	class={cn('border-b relative w-full bg-background', {
		'h-full max-h-screen absolute overflow-y-auto': isMobileDropdownOpen
	})}
>
	<header class="flex items-center mx-auto h-20 max-w-7xl justify-between p-4">
		<div class="flex items-center gap-8">
			<img src={Logo} class="size-14" alt="echo Logo" />

			<menu class="gap-1 items-center hidden lg:flex">
				<HeaderLink href="/">Hjem</HeaderLink>
				{#each routes as route}
					<HeaderButton label={route.label} links={route.links} />
				{/each}
			</menu>
		</div>

		<div class="flex items-center gap-4">
			<ThemeButton />
			<button class="btn btn-primary">Logg inn</button>
			<button class="lg:hidden block" onclick={toggleMenu}>
				{#if isMobileDropdownOpen}
					<X class="size-6" />
				{:else}
					<Menu class="size-6" />
				{/if}
				<span class="sr-only">Toggle mobile menu</span>
			</button>
		</div>
	</header>

	<HeaderDesktopDropdown />

	{#if isMobileDropdownOpen}
		<div in:slide={{ delay: 400 }} class="flex flex-col felx-1 absolute w-full p-4">
			<menu class="flex flex-col gap-1 p-4">
				<li class="flex">
					<a
						href="/"
						class="rounded-md p-4 w-full text-2xl text-gray-600 hover:bg-muted dark:text-foreground"
					>
						<span class="text-2xl">Hjem</span>
					</a>
				</li>
				{#each routes as route}
					<li class="flex w-full">
						<div class="flex flex-col w-full">
							<button
								class="rounded-md w-full text-left p-4 text-2xl text-gray-600 hover:bg-muted dark:text-foreground"
								onclick={() => toggleLabel(route.label)}
							>
								{route.label}
								<ChevronDown
									class={[
										'inline size-6',
										activeMobileLabel === route.label ? 'rotate-180' : 'rotate-0'
									]}
								/>
							</button>

							{#if activeMobileLabel === route.label}
								<ul transition:slide class="flex flex-col gap-1 pl-4">
									{#each route.links as subRoute}
										{@const Icon = subRoute.icon}
										<li>
											<a
												href={subRoute.href}
												class="text-lg flex items-center gap-8 p-4 hover:bg-muted"
											>
												<div class="shrink-0">
													<Icon class="size-6" />
												</div>
												<div class="flex flex-col">
													<span class="text-gray-600 dark:text-gray-100">
														{subRoute.label}
													</span>
													<span class="text-sm text-muted-foreground">
														{subRoute.description}
													</span>
												</div>
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</li>
				{/each}
			</menu>
			<div class="flex flex-col gap-1 p-4">
				<button class="btn-primary">Logg inn</button>
			</div>
		</div>
	{/if}
</div>
