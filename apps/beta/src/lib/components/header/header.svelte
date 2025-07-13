<script lang="ts">
	import Logo from '$lib/assets/images/echo-logo.png';
	import { setHeaderContext } from '$lib/context/header';
	import HeaderButton from './header-button.svelte';
	import HeaderLink from './header-link.svelte';
	import HeaderDesktopDropdown from './header-desktop-dropdown.svelte';

	import ThemeButton from './theme-button.svelte';
	import { routes } from '$lib/routes';
	import { browser, dev } from '$app/environment';
	import { ChevronDown, Menu, X } from '@lucide/svelte';
	import { cn } from '$lib/cn';
	import { fly, slide } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';
	import { getRandomMessage } from '$lib/random-message';
	import { AuthContext } from '$lib/context/auth';
	import { enhance } from '$app/forms';
	import { initials } from '$lib/strings';
	import Avatar from '../ui/avatar.svelte';
	import Button from '../ui/button.svelte';

	const message = getRandomMessage();

	let isMobileDropdownOpen = $state(false);
	let activeMobileLabel = $state<string | null>(null);
	let innerWidth = $state(browser ? window.innerWidth : 0);
	let context = $state({
		openRoutes: null
	});
	setHeaderContext(context);

	let auth = AuthContext.get();

	const toggleMenu = () => {
		if (innerWidth < 768) {
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
		if (innerWidth < 768) {
			context.openRoutes = null;
		}

		if (innerWidth >= 768) {
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
	class={cn('bg-background relative z-50 w-full border-b', {
		'absolute h-full max-h-screen overflow-y-auto': isMobileDropdownOpen
	})}
>
	{#if dev}
		<div class="bg-destructive text-destructive-foreground p-2">
			<p class="text-center text-sm font-medium">Developer mode</p>
		</div>
	{/if}

	<header class="relative mx-auto flex h-20 max-w-7xl items-center justify-between p-4">
		<div class="flex items-center gap-8">
			<a href="/">
				<img src={Logo} class="size-14" alt="echo Logo" />
			</a>

			<menu class="mt-auto hidden items-center md:flex">
				<HeaderLink href="/">Hjem</HeaderLink>
				{#each routes as route}
					<HeaderButton label={route.label} links={route.links} />
				{/each}
			</menu>
		</div>

		<div class="flex items-center gap-4">
			<ThemeButton />

			{#if auth.user}
				<a class="block" href="/profil">
					<Avatar
						src={auth.user.image ?? ''}
						alt={auth.user.name ?? 'Profilbilde'}
						fallback={initials(auth.user.name ?? 'ON')}
					/>
				</a>

				<form method="post" action="/logg-ut" use:enhance>
					<Button variant="secondary">Logg ut</Button>
				</form>
			{:else}
				<Button variant="secondary" href="/logg-inn">Logg inn</Button>
			{/if}

			<button class="block md:hidden" onclick={toggleMenu}>
				{#if isMobileDropdownOpen}
					<X class="size-6" />
				{:else}
					<Menu class="size-6" />
				{/if}
				<span class="sr-only">Toggle mobile menu</span>
			</button>
		</div>

		<div class="absolute -bottom-3 flex space-x-2">
			{#if message.link}
				<a class="z-[80]" href={message.link}>
					<span
						class="border-primary-dark bg-primary text-primary-foreground inline-block rounded-full border-2 px-3 py-1 text-xs font-semibold"
					>
						{message.text}
					</span>
				</a>
			{:else}
				<span
					class="border-primary-dark bg-primary text-primary-foreground z-[80] inline-block rounded-full border-2 px-3 py-1 text-xs font-semibold"
				>
					{message.text}
				</span>
			{/if}
		</div>
	</header>

	<HeaderDesktopDropdown />

	{#if isMobileDropdownOpen}
		<div in:fly={{ delay: 200, x: -800 }} class="absolute flex w-full flex-1 flex-col p-4">
			<menu class="flex flex-col gap-1">
				<li class="flex">
					<a
						href="/"
						class="hover:bg-muted dark:text-foreground w-full rounded-md p-4 text-2xl text-gray-600"
					>
						<span class="text-2xl">Hjem</span>
					</a>
				</li>
				{#each routes as route}
					<li class="flex w-full">
						<div class="flex w-full flex-col">
							<button
								class="hover:bg-muted dark:text-foreground w-full rounded-md p-4 text-left text-2xl text-gray-600"
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
											<a href={subRoute.href} class="hover:bg-muted flex items-center gap-4 p-2">
												<div class="shrink-0">
													<Icon class="size-6" />
												</div>
												<div class="flex flex-col">
													<span class="font-medium text-gray-600 dark:text-gray-100">
														{subRoute.label}
													</span>
													<span class="text-muted-foreground text-sm">
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
		</div>
	{/if}
</div>
