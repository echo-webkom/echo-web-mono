<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import WebkomLogo from '$lib/assets/images/webkom.png';
	import { Crown } from '@lucide/svelte';
</script>

<Container class="flex-col text-center">
	<div>
		<img alt="Webkom logo" class="mx-auto h-32 w-auto" src={WebkomLogo} />
		<Heading class="w-fit mx-auto font-mono">Webkom</Heading>

		<!-- Forslag om å opprette gruppe var 28. jul 2020 -->
		<!-- Slack ble laget 5. aug 2020 -->
		<p class="break-words py-1 text-xs text-muted-foreground">EST. 2020</p>
		<p class="break-words py-1 text-lg text-muted-foreground">
			Tidligere og nåværende medlemmer av echo Webkom.
		</p>
	</div>

	<div class="mx-auto my-10 max-w-md space-y-8">
		<ul class="space-y-1 list-none p-0 text-lg">
			<li class="text-lg relative mx-auto w-fit">
				<Crown class="absolute fill-yellow-400 -left-6 top-1 text-yellow-400 size-4" />
				<span>Andreas Bakseter (Co-founder)</span>
			</li>
			<li class="text-lg relative mx-auto w-fit">
				<Crown class="absolute -left-6 top-1 fill-yellow-400 text-yellow-400 size-4" />
				<span>Bo Aanes (Co-founder)</span>
			</li>
		</ul>

		<!-- H20 -->
		<ul class="space-y-1 list-none p-0 text-lg">
			<li class="text-lg">Alvar Hønsi</li>
			<li class="text-lg">Øyvind Grutle</li>
			<li class="text-lg">Sander Sigmundstad</li>
			<li class="text-lg">Victoria Valner</li>
		</ul>

		<!-- H21 -->
		<ul class="space-y-1 list-none p-0 text-lg">
			<li class="text-lg">Nikolaus Engh</li>
			<li class="text-lg">Ole Magnus Fon Johnsen</li>
			<li class="text-lg">Mathilde Bergenheim</li>
			<li class="text-lg">Thea Jenny Kolnes</li>
			<li class="text-lg">Felix Kaasa</li>
		</ul>

		<!-- H22 -->
		<ul class="space-y-1 list-none p-0 text-lg">
			<li class="text-lg">Torger Bocianowski</li>
			<li class="text-lg">Malin Torset Sivertstøl</li>
			<li class="text-lg">Karolina Gil</li>
			<li class="text-lg">Leoul Zinaye Tefera</li>
			<li class="text-lg">Kjetil Alvestad</li>
			<li class="text-lg">Jonas Hammerseth</li>
		</ul>

		<!-- H23 -->
		<ul class="space-y-1 list-none p-0 text-lg">
			<li class="text-lg">Johanne Blikberg Herheim</li>
			<li class="text-lg">Kristian Elde Johansen</li>
			<li class="text-lg">Swarnika Sellathurai</li>
			<li class="text-lg">Zeno Elio Leonardi</li>
			<li class="text-lg">Izaak Sarnecki</li>
			<li class="text-lg">Wengeal Abebe</li>
			<li class="text-lg">Hermann Holstad Walaunet</li>
		</ul>

		<!-- V24 -->
		<ul class="space-y-1 list-none p-0 text-lg">
			<li class="text-lg">Jesper Kierulf Hammer</li>
		</ul>

		<!-- H24 -->
		<ul class="space-y-1 list-none p-0 text-lg">
			<li class="text-lg">Andreas Drevdal</li>
			<li class="text-lg">Birk Monsen</li>
		</ul>
	</div>
</Container>
