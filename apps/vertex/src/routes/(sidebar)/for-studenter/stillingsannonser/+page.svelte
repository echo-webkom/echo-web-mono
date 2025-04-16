<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import Label from '$lib/components/ui/form/label.svelte';
	import Input from '$lib/components/ui/form/input.svelte';
	import Select from '$lib/components/ui/form/select.svelte';
	import { Briefcase, Calendar, Coffee, Pin } from '@lucide/svelte';
	import { urlFor } from '$lib/sanity/client.js';
	import { JOB_TYPES } from '@echo-webkom/lib';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale';

	let { data } = $props();

	let search = $state('');
	let location = $state('');
	let sortBy = $state('expiresSoon');
	let jobType = $state('');
	let company = $state('');

	let possibleLocations = $derived.by(() => {
		return Array.from(
			new Set(data.jobs.flatMap((job) => job.locations).map((location) => location.name))
		);
	});

	let possibleCompanies = $derived.by(() => {
		return Array.from(new Set(data.jobs.map((job) => job.company.name)));
	});

	let matchingJobs = $derived.by(() => {
		return (
			data.jobs
				.filter((job) => {
					const searchMatch = search
						? job.title.toLowerCase().includes(search.toLowerCase())
						: true;
					const locationMatch = location
						? job.locations.some((l) => l.name.toLocaleLowerCase().includes(location.toLowerCase()))
						: true;
					const jobTypeMatch = jobType
						? job.jobType.toLowerCase().includes(jobType.toLowerCase())
						: true;
					const companyMatch = company
						? job.company.name.toLowerCase().includes(company.toLowerCase())
						: true;

					return searchMatch && locationMatch && jobTypeMatch && companyMatch;
				})
				// @ts-ignore
				.sort((a, b) => {
					if (sortBy === 'newest') {
						return new Date(b._createdAt ?? 0).getTime() - new Date(a._createdAt ?? 0).getTime();
					} else if (sortBy === 'oldest') {
						return new Date(a._createdAt ?? 0).getTime() - new Date(b._createdAt ?? 0).getTime();
					} else if (sortBy === 'expiresSoon') {
						return new Date(a.expiresAt ?? 0).getTime() - new Date(b.expiresAt ?? 0).getTime();
					} else if (sortBy === 'expiresLate') {
						return new Date(b.expiresAt ?? 0).getTime() - new Date(a.expiresAt ?? 0).getTime();
					}
				})
		);
	});
</script>

<div class="space-y-4 mb-8">
	<Heading>Stillingsannonser</Heading>
	<p>
		Her finner du en oversikt over alle stillingsannonsene vi har tilgjengelig. Du kan filtrere på
		sted, stillingstype og bedrift for å finne stillingen som passer best for deg.
	</p>
	<p>
		Ønsker du å legge ut en stillingsannonse? Les mer om hvordan du kan gjøre det <a
			class="dark:text-blue-400 text-blue-600 hover:underline"
			href="/for-bedrifter/stillingsannonser">her</a
		>.
	</p>
</div>

<div class="flex items-center gap-3">
	<div class="w-full">
		<Label for="search">Søk</Label>
		<Input id="search" type="text" bind:value={search} placeholder="Søk etter stillingsannonser" />
	</div>
	<div class="w-full">
		<Label for="location">Sted</Label>
		<Select bind:value={location}>
			<option value="" selected>Alle steder</option>
			{#each possibleLocations as location}
				<option value={location}>{location}</option>
			{/each}
		</Select>
	</div>
	<div class="w-full">
		<Label for="sortBy">Sorter etter</Label>
		<Select bind:value={sortBy}>
			<option value="newest">Nyeste først</option>
			<option value="oldest">Eldste først</option>
			<option value="expiresSoon">Utløper snart</option>
			<option value="expiresLate">Utløper senere</option>
		</Select>
	</div>
	<div class="w-full">
		<Label for="jobType">Stillingstype</Label>
		<Select bind:value={jobType}>
			<option value="" selected>Alle stillingstyper</option>
			{#each JOB_TYPES as jobType}
				<option value={jobType.value}>{jobType.title}</option>
			{/each}
		</Select>
	</div>
	<div class="w-full">
		<Label for="company">Bedrift</Label>
		<Select bind:value={company}>
			<option value="" selected>Alle bedrifter</option>
			{#each possibleCompanies as company}
				<option value={company}>{company}</option>
			{/each}
		</Select>
	</div>
</div>

<hr class="my-4" />

<p class="text-sm text-muted-foreground">Antall resultater: {matchingJobs.length}</p>

{#if matchingJobs.length > 0}
	<ul class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		{#each matchingJobs as job}
			<li>
				<a href="/for-studenter/stillingsannonser/{job.slug}">
					<div
						class="h-30 flex flex-row items-center gap-8 rounded-xl border-2 p-6 hover:bg-muted transition-colors duration-200 ease-in-out border-border"
					>
						<div class="block">
							<div class="relative h-20 w-20 overflow-hidden rounded-full border-2 bg-white">
								<img alt="Universitetet i Bergen logo" src={urlFor(job.company.image).url()} />
							</div>
						</div>

						<div class="flex h-full w-full flex-col gap-1 overflow-x-hidden">
							<h3 class="line-clamp-2 text-lg font-semibold">
								{job.title}
							</h3>
							<ul class="mt-auto flex flex-wrap gap-3 gap-y-1 p-0 text-sm">
								<li class="flex items-center gap-2">
									<Briefcase class="h-4 w-4 text-yellow-800" />
									{job.company.name}
								</li>
								<li class="flex items-center gap-2">
									<Pin class="h-4 w-4 text-red-600" />
									{job.locations.map((location) => location.name).join(', ')}
								</li>
								<li class="flex items-center gap-2">
									<Calendar class="h-4 w-4 text-stone-700 dark:text-stone-400" />
									{format(job.expiresAt, 'dd.MM.yyyy', { locale: nb })}
								</li>
								<li class="flex items-center gap-2">
									<Coffee class="h-4 w-4 text-amber-900" />
									{JOB_TYPES.find((jt) => jt.value === job.jobType)?.title}
								</li>
							</ul>
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
{:else}
	<div class="mx-auto w-fit py-8">
		<p class="mb-2 text-7xl">:(</p>
		<p class="text-center text-2xl">Finner ingen stillingsannonsener</p>
	</div>
{/if}
