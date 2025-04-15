<script lang="ts">
	import { GitCommit, Rss } from '@lucide/svelte';
	import Sanity from '$lib/assets/svg/sanity-logo.svg';
	import Bekk from '$lib/assets/images/bekk.png';
</script>

<footer
	class="relative rounded-t-[40px] border-2 border-footer-border bg-footer px-10 py-24 text-footer-foreground"
>
	<!-- Latest commit -->
	<div class="absolute bottom-0 left-0 p-1.5">
		<p class="font-mono text-xs text-muted-foreground">
			<a
				class="flex items-center gap-1 hover:underline"
				href="https://github.com/echo-webkom/echo-web-mono/commit/052a8c60122981aed3b6ee79e246421c51dfb8a3"
			>
				<GitCommit class="size-4" />
				052a8c6
			</a>
		</p>
	</div>

	<!-- Link to RSS feed -->
	<div class="absolute bottom-0 left-1/2 -translate-x-1/2 p-1.5">
		<ul class="flex flex-row gap-2 font-mono text-xs text-muted-foreground">
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
						<a
							class="flex items-center gap-2 hover:underline"
							target="_blank"
							rel="noreferrer"
							href="mailto:echo@uib.no">echo@uib.no</a
						>
					</li>
					<li>
						<a
							class="flex items-center gap-2 hover:underline"
							target="_blank"
							rel="noreferrer"
							href="https://goo.gl/maps/adUsBsoZh3QqNvA36">Thormøhlens gate 55 5006 BERGEN</a
						>
					</li>
					<li>
						<a
							class="flex items-center gap-2 hover:underline"
							target="_blank"
							rel="noreferrer"
							href="https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=998995035"
							>Organisasjonsnummer: 998 995 035</a
						>
					</li>
					<li>
						<a class="flex items-center gap-2 hover:underline" href="/for-studenter/speak-up"
							>Opplevd noe kjipt? Speak up!</a
						>
					</li>
					<li>
						<a class="flex items-center gap-2 hover:underline" href="/personvern"
							>Personvernerklæring</a
						>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 py-2 text-xl font-bold">Følg oss 💻</h3>
				<ul class="space-y-1">
					<li>
						<a
							class="flex items-center gap-2 hover:underline"
							target="_blank"
							rel="noreferrer"
							href="https://www.facebook.com/groups/informatikk">Facebook</a
						>
					</li>
					<li>
						<a
							class="flex items-center gap-2 hover:underline"
							target="_blank"
							rel="noreferrer"
							href="https://www.instagram.com/echo_uib/">Instagram</a
						>
					</li>
					<li>
						<a
							class="flex items-center gap-2 hover:underline"
							target="_blank"
							rel="noreferrer"
							href="https://github.com/echo-webkom">GitHub</a
						>
					</li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 py-2 text-xl font-bold">Hovedsamarbeidspartner 💘</h3>
				<a target="_blank" rel="noreferrer" href="https://bekk.no"
					><img src={Bekk} alt="Bekk logo" class="h-28 w-auto invert dark:invert-0" /></a
				>
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
