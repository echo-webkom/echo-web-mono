<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale';

	let { data } = $props();
</script>

<main class="mx-auto mb-20 flex w-full max-w-[1200px] flex-col px-4 sm:px-6 lg:px-8">
	<div class="mt-32 mb-24 space-y-16">
		<div class="mx-auto max-w-screen-md text-center">
			<h1 class="mb-8 text-4xl font-semibold text-gray-700 sm:text-5xl dark:text-gray-200">
				echo – Linjeforeningen for informatikk
			</h1>
			<p class="text-muted-foreground mx-auto max-w-screen-md font-medium md:text-xl">
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
		<div class="grid grid-cols-1 gap-16 md:grid-cols-2">
			<div class="flex h-full flex-col">
				<h2 class="mb-4 text-xl font-medium">Hva er echo?</h2>

				<p>
					echo består av frivillige informatikkstudenter, og er delt inn i et hovedstyre og en rekke
					undergrupper, komiteer og interesseorganisasjoner. Hovedstyret vårt består av sju
					demokratisk valgte studenter og syv representanter fra undergruppere. Vi er
					linjeforeningen for informatikk ved Universitetet i Bergen, men har også et overordnet
					ansvar for studentsaker som angår det faglige ved instituttet.
				</p>
			</div>

			<div class="flex h-full flex-col">
				<h2 class="mb-4 text-xl font-medium">For bedrifter</h2>

				<p>
					Vi tilbyr også muligheten for bedrifter til å presentere seg for informatikkstudentene ved
					Universitetet i Bergen. Dette kan gjøres gjennom bedriftspresentasjoner, workshops, kurs
					og andre arrangementer. Vi tilbyr også muligheten for bedrifter å annonsere ledige
					stillinger og internship på nettsiden vår.
				</p>

				<p class="mt-auto">
					<a class="text-primary hover:underline" href="/">Les om bedriftspresentasjoner →</a>
				</p>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-16 md:grid-cols-2">
			<div>
				<h2 class="mb-4 text-xl font-medium">Arrangementer</h2>

				{#each data.events as event}
					<a
						href="/arrangement/{event.slug}"
						class="mb-1 flex items-center justify-between hover:underline"
					>
						<h3 class="line-clamp-1 truncate font-medium">{event.title}</h3>
						<p class="text-muted-foreground">{format(event.date, 'eee. dd.MM', { locale: nb })}</p>
					</a>
				{:else}
					<p class="text-muted-foreeground">Ingen kommende arrangementer.</p>
				{/each}
			</div>

			<div>
				<h2 class="mb-4 text-xl font-medium">Bedriftspresentasjoner</h2>

				{#each data.bedpres as bedpres}
					<a
						href="/bedpres/{bedpres.slug}"
						class="mb-1 flex items-center justify-between hover:underline"
					>
						<h3 class="line-clamp-1 truncate font-medium">{bedpres.title}</h3>
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
