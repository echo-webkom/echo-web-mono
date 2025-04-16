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
	import { fly, slide } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';
	import { getRandomMessage } from '$lib/random-message';

	const message = getRandomMessage();

	let isMobileDropdownOpen = $state(false);
	let activeMobileLabel = $state<string | null>(null);
	let innerWidth = $state(browser ? window.innerWidth : 0);
	let context = $state({
		openRoutes: null
	});
	setHeaderContext(context);

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
	class={cn('border-b relative w-full bg-background z-50', {
		'h-full max-h-screen absolute overflow-y-auto': isMobileDropdownOpen
	})}
>
	<header class="relative flex items-center mx-auto h-20 max-w-7xl justify-between p-4">
		<div class="flex items-center gap-8">
			<a href="/">
				<img src={Logo} class="size-14" alt="echo Logo" />
			</a>

			<menu class="gap-1 items-center hidden md:flex">
				<HeaderLink href="/">Hjem</HeaderLink>
				{#each routes as route}
					<HeaderButton label={route.label} links={route.links} />
				{/each}
			</menu>
		</div>

		<div class="flex items-center gap-4">
			<ThemeButton />
			<a href="/logg-inn" class="btn-secondary hover:underline">Logg inn</a>
			<button class="md:hidden block" onclick={toggleMenu}>
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
						class="inline-block rounded-full border-2 px-3 py-1 text-xs font-semibold border-primary-dark bg-primary text-primary-foreground"
					>
						{message.text}
					</span>
				</a>
			{:else}
				<span
					class="inline-block z-[80] rounded-full border-2 px-3 py-1 text-xs font-semibold border-primary-dark bg-primary text-primary-foreground"
				>
					{message.text}
				</span>
			{/if}
		</div>
	</header>

	<HeaderDesktopDropdown />

	{#if isMobileDropdownOpen}
		<div in:fly={{ delay: 200, x: -800 }} class="flex flex-col felx-1 absolute w-full p-4">
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
		</div>
	{/if}
</div>
