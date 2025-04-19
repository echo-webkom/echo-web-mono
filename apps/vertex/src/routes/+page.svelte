<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale';

	let { data } = $props();
</script>

<main class="mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8 max-w-[1200px] mb-20">
	<div class="mb-24 mt-32 space-y-16">
		<div class="mx-auto max-w-screen-md text-center">
			<h1 class="text-4xl mb-8 font-semibold text-gray-700 dark:text-gray-200 sm:text-5xl">
				echo – Linjeforeningen for informatikk
			</h1>
			<p class="mx-auto max-w-screen-md font-medium text-muted-foreground md:text-xl">
				Vi i echo jobber med å gjøre studiehverdagen for informatikkstudenter bedre ved å arrangere
				sosiale og faglige arrangementer.
			</p>
		</div>

		<div class="flex justify-center gap-4">
			<Button variant="secondary" href="/logg-inn">Logg inn</Button>
			<Button variant="outline" href="/om/echo">Les mer om echo</Button>
		</div>
	</div>

	<div class="mx-auto mt-10 max-w-screen-lg space-y-32">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-16">
			<div class="h-full flex flex-col">
				<h2 class="font-medium text-xl mb-4">Hva er echo?</h2>

				<p>
					echo består av frivillige informatikkstudenter, og er delt inn i et hovedstyre og en rekke
					undergrupper, komiteer og interesseorganisasjoner. Hovedstyret vårt består av sju
					demokratisk valgte studenter og syv representanter fra undergruppere. Vi er
					linjeforeningen for informatikk ved Universitetet i Bergen, men har også et overordnet
					ansvar for studentsaker som angår det faglige ved instituttet.
				</p>
			</div>

			<div class="h-full flex flex-col">
				<h2 class="font-medium text-xl mb-4">For bedrifter</h2>

				<p>
					Vi tilbyr også muligheten for bedrifter til å presentere seg for informatikkstudentene ved
					Universitetet i Bergen. Dette kan gjøres gjennom bedriftspresentasjoner, workshops, kurs
					og andre arrangementer. Vi tilbyr også muligheten for bedrifter å annonsere ledige
					stillinger og internship på nettsiden vår.
				</p>

				<p class="mt-auto">
					<a class="hover:underline text-primary" href="/">Les om bedriftspresentasjoner →</a>
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-16">
			<div>
				<h2 class="font-medium text-xl mb-4">Arrangementer</h2>

				{#each data.events as event}
					<a
						href="/arrangement/{event.slug}"
						class="mb-1 flex items-center justify-between hover:underline"
					>
						<h3 class="font-medium truncate line-clamp-1">{event.title}</h3>
						<p class="text-muted-foreground">{format(event.date, 'eee. dd.MM', { locale: nb })}</p>
					</a>
				{:else}
					<p class="text-muted-foreeground">Ingen kommende arrangementer.</p>
				{/each}
			</div>

			<div>
				<h2 class="font-medium text-xl mb-4">Bedriftspresentasjoner</h2>

				{#each data.bedpres as bedpres}
					<a
						href="/bedpres/{bedpres.slug}"
						class="mb-1 flex items-center justify-between hover:underline"
					>
						<h3 class="font-medium truncate line-clamp-1">{bedpres.title}</h3>
						<p class="text-muted-foreground">
							{format(bedpres.date, 'eee. dd.MM', { locale: nb })}
						</p>
					</a>
				{:else}
					<p class="text-muted-foreground">Ingen kommende arrangementer.</p>
				{/each}
			</div>
		</div>
	</div>
</main>
