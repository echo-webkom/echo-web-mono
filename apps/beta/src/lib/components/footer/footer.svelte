<script lang="ts">
	import { ExternalLink, GitCommit, Rss } from '@lucide/svelte';
	import { PUBLIC_COMMIT_HASH } from '$env/static/public';
	import Sanity from '$lib/assets/svg/sanity-logo.svg';

	const contactUsLinks = [
		{
			label: 'echo@uib.no',
			href: 'mailto:echo@uib.no'
		},
		{
			label: 'Thormøhlens gate 55 5006 BERGEN',
			href: 'https://goo.gl/maps/adUsBsoZh3QqNvA36'
		},
		{
			label: 'Organisasjonsnummer: 998 995 035',
			href: 'https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=998995035'
		},
		{
			label: 'Opplevd noe kjipt? Speak up!',
			href: '/for-studenter/speak-up'
		},
		{
			label: 'Personvernerklæring',
			href: '/personvern'
		}
	];

	const socialsLinks = [
		{
			label: 'Facebook',
			href: 'https://www.facebook.com/groups/informatikk'
		},
		{
			label: 'Instagram',
			href: 'https://www.instagram.com/echo_uib/'
		},
		{
			label: 'GitHub',
			href: 'https://github.com/echo-webkom'
		}
	];

	const displayHash = PUBLIC_COMMIT_HASH === '' ? null : PUBLIC_COMMIT_HASH?.slice(0, 7);
</script>

<footer
	class="border-footer-border bg-footer text-footer-foreground relative rounded-t-[40px] border-2 px-10 py-24"
>
	<!-- Latest commit -->
	{#if displayHash}
		<div class="absolute bottom-0 left-0 p-1.5">
			<p class="text-muted-foreground font-mono text-xs">
				<a
					class="flex items-center gap-1 hover:underline"
					href="https://github.com/echo-webkom/echo-web-mono/commit/{PUBLIC_COMMIT_HASH}"
				>
					<GitCommit class="size-4" />
					{displayHash}
				</a>
			</p>
		</div>
	{/if}

	<!-- Link to RSS feed -->
	<div class="absolute bottom-0 left-1/2 -translate-x-1/2 p-1.5">
		<ul class="text-muted-foreground flex flex-row gap-2 font-mono text-xs">
			<li>
				<a class="flex items-center gap-1 hover:underline" href="/feed">
					<Rss class="size-4" />
					RSS Feed
				</a>
			</li>
		</ul>
	</div>

	<div class="mx-auto flex w-full max-w-7xl">
		<div class="flex w-full flex-wrap justify-between gap-10 sm:gap-20">
			<div>
				<h3 class="mb-4 py-2 text-xl font-bold">Kontakt oss ☎️</h3>
				<ul class="space-y-1">
					<li>
						{#each contactUsLinks as link}
							{@const isExternal = link.href.startsWith('http')}
							{#if isExternal}
								<a
									class="flex items-center gap-2 hover:underline"
									target="_blank"
									rel="noreferrer"
									href={link.href}
									>{link.label} <ExternalLink class="size-3" />
								</a>
							{:else}
								<a class="flex items-center gap-2 hover:underline" href={link.href}
									>{link.label}
								</a>
							{/if}
						{/each}
					</li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 py-2 text-xl font-bold">Følg oss 💻</h3>
				<ul class="space-y-1">
					{#each socialsLinks as social}
						<li>
							<a
								class="flex items-center gap-2 hover:underline"
								target="_blank"
								rel="noreferrer"
								href={social.href}>{social.label} <ExternalLink class="size-3" /></a
							>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<h3 class="mb-4 py-2 text-xl font-bold">Powered by 🔧</h3>
				<ul class="space-y-5">
					<li>
						<a target="_blank" rel="noreferrer" href="https://www.sanity.io/">
							<img src={Sanity} alt="Sanity logo" />
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>
