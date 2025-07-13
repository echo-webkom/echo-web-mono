<script lang="ts">
	import { page } from '$app/state';
	import { urlFor } from '$lib/sanity/image';
	import { ExternalLink } from '@lucide/svelte';
	import type { PageData } from '../$types';
	import { format, isFuture, isPast } from 'date-fns';
	import { nb } from 'date-fns/locale';
	import { capitalize } from '$lib/strings';
	import RegistrationButton from './registration-button.svelte';

	let data = $derived(page.data as PageData);

	let isRegistrationOpen = $derived.by(() => {
		if (!data.event.registrationStart || !data.event.registrationEnd) {
			return false;
		}
		return isFuture(data.event.registrationEnd) && isPast(data.event.registrationStart);
	});
	let totalSpots = $derived.by(() => {
		return (
			data.event.spotRanges?.reduce((acc, range) => {
				return acc + range.spots;
			}, 0) || 'inf'
		);
	});
</script>

<aside class="h-fit w-full border-b-2 pr-4 pb-16 md:w-[270px] md:border-r-2 md:border-b-0 md:pb-0">
	{#if data.event.company?.image}
		<a href={data.event.company.website} target="_blank" rel="noopener noreferrer">
			<div class="mb-4 aspect-square w-full overflow-hidden">
				<img
					src={urlFor(data.event.company.image).url()}
					alt="Company logo"
					class="h-full w-full rounded-xl border-2 object-cover"
				/>
			</div>
		</a>
	{/if}

	<ul class="flex flex-col gap-2">
		{#if data.event.company}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Bedrift</p>
				<p class="text-sm">
					<a
						class="hover:underline"
						href={data.event.company.website}
						target="_blank"
						rel="noopener noreferrer"
					>
						{data.event.company.name}
						<ExternalLink class="ml-1 inline size-3" />
					</a>
				</p>
			</li>
		{/if}

		<li class="flex flex-col">
			<p class="text-muted-foreground text-xs font-bold">Klokkeslett</p>
			<p class="text-sm">
				{format(new Date(data.event.date), 'HH:mm')}
			</p>
		</li>

		<li class="flex flex-col">
			<p class="text-muted-foreground text-xs font-bold">Dato</p>
			<p class="text-sm">
				{format(new Date(data.event.date), 'dd.MM.yyyy')}
			</p>
		</li>

		{#if data.registrationCount.registered > 0}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Påmeldte</p>
				<p class="text-sm">
					{data.registrationCount.registered} / {totalSpots}
				</p>
			</li>
		{/if}

		{#if data.registrationCount.waitlisted > 0}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Venteliste</p>
				<p class="text-sm">
					{data.registrationCount.waitlisted}
				</p>
			</li>
		{/if}

		{#if data.event.contacts}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Kontaktpersoner</p>
				<ul class="flex flex-col text-sm">
					{#each data.event.contacts as contact}
						<li class="flex flex-col">
							<p>
								<a class="hover:underline" href="mailto:{contact.email}">
									{contact.profile.name}
									<ExternalLink class="ml-1 inline size-3" />
								</a>
							</p>
						</li>
					{/each}
				</ul>
			</li>
		{/if}

		{#if data.event.location}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Sted</p>
				<p class="text-sm">
					{data.event.location?.name}
				</p>
			</li>
		{/if}

		{#if data.event.registrationStart}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Påmelding åpner</p>
				<p class="text-sm">
					{capitalize(
						format(new Date(data.event.registrationStart), "EEEE dd. MMMM 'kl' HH:mm", {
							locale: nb
						})
					)}
				</p>
			</li>
		{/if}

		{#if data.event.registrationEnd}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Påmelding stenger</p>
				<p class="text-sm">
					{capitalize(
						format(new Date(data.event.registrationEnd), "EEEE dd. MMMM 'kl' HH:mm", {
							locale: nb
						})
					)}
				</p>
			</li>
		{/if}

		{#if data.event.externalLink}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Ekstern lenke</p>
				<p>
					<a class="hover:underline" href={data.event.externalLink}>
						{data.event.externalLink}
						<ExternalLink class="ml-1 inline size-3" />
					</a>
				</p>
			</li>
		{/if}

		{#if data.event.cost && data.event.cost !== 0}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Egenandel</p>
				<p class="text-sm">
					{data.event.cost} kr
				</p>
			</li>
		{/if}

		{#if data.event.registrationStartGroups}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-sm font-bold">Påmelding for grupper åpner</p>
				<p class="text-sm">
					{capitalize(
						format(new Date(data.event.registrationStartGroups), "EEEE dd. MMMM 'kl' HH:mm", {
							locale: nb
						})
					)}
				</p>
			</li>
		{/if}

		{#if data.event.endDate}
			<li class="flex flex-col">
				<p class="text-muted-foreground text-xs font-bold">Sluttdato</p>
				<p class="text-sm">
					{format(new Date(data.event.endDate), 'EEE dd. MMMM', {
						locale: nb
					})}
				</p>
			</li>
		{/if}
	</ul>

	{#if isRegistrationOpen}
		<RegistrationButton />
	{/if}
</aside>
