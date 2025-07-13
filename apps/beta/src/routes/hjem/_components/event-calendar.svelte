<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/cn';
	import { browser } from '$app/environment';
	import { addDays, getWeek, startOfWeek, subDays } from 'date-fns';
	import { ArrowLeft, ArrowRight, Circle, RotateCcw } from '@lucide/svelte';
	import type { PageData } from '../$types';

	let data = $derived(page.data as PageData);
	let events = $derived(data.allEvents);

	const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
	const TODAY = new Date();

	let innerWidth = $state(browser ? window.innerWidth : 0);
	let daysVisible = $state(7);
	let isDirty = $state(false);
	let date = $state(TODAY);

	let startDate = $derived.by(() => {
		if (daysVisible === 7) {
			return startOfWeek(date);
		}
		return date;
	});
	let endDate = $derived.by(() => {
		if (daysVisible === 7) {
			return addDays(startDate, 6);
		}
		return addDays(startDate, daysVisible - 1);
	});
	let startWeek = $derived(getWeek(startDate));
	let endWeek = $derived(getWeek(endDate));

	let calenderTypes = $state([
		{
			name: 'Bedriftspresentasjon',
			type: 'bedpres',
			active: true
		},
		{
			name: 'Arrangement',
			type: 'event',
			active: true
		},
		{
			name: 'Filmklubben',
			type: 'movie',
			active: true
		},
		{
			name: 'Brettspill',
			type: 'boardgame',
			active: true
		},
		{
			name: 'Ekstern',
			type: 'external',
			active: true
		}
	]);

	const typeColors: Record<number, { fill: string; text: string; row: string }> = {
		0: { fill: 'fill-primary', text: 'text-primary', row: 'border-l-primary hover:bg-primary' },
		1: {
			fill: 'fill-secondary',
			text: 'text-secondary',
			row: 'border-l-secondary hover:bg-secondary dark:hover:text-gray-800'
		},
		2: {
			fill: 'fill-pink-400',
			text: 'text-pink-400',
			row: 'border-l-pink-400 hover:bg-pink-400'
		},
		3: {
			fill: 'fill-green-600',
			text: 'text-green-600',
			row: 'border-l-green-600 hover:bg-green-600'
		},
		4: {
			fill: 'fill-gray-600',
			text: 'text-gray-600',
			row: 'border-l-gray-600, hover:bg-gray-600'
		}
	};

	$effect(() => {
		if (isDirty) return;

		if (innerWidth < 640) {
			daysVisible = 1;
		} else if (innerWidth < 768) {
			daysVisible = 3;
		} else if (innerWidth < 1024) {
			daysVisible = 5;
		} else {
			daysVisible = 7;
		}
	});

	const handleChangeDaysVisible = (days: number) => {
		daysVisible = days;
		isDirty = true;
	};

	const getType = (author: string | null, type: string): CalendarEventType => {
		if (type === 'bedpres') {
			return 'bedpres';
		} else if (type === 'external') {
			return 'external';
		} else if (author === 'filmklubben') {
			return 'movie';
		} else if (type === 'brettspill') {
			return 'boardgame';
		}

		return 'event';
	};

	type CalendarEventType = 'event' | 'bedpres' | 'movie' | 'boardgame' | 'external';

	type CalendarEvent = {
		id: string;
		slug: string;
		title: string;
		start: Date;
		end: Date | null;
		description: string | null;
		type: CalendarEventType;
	};

	const calendarEvents = $derived(
		events.map((event) => {
			return {
				id: event._id,
				slug: event.slug,
				title: event.title,
				start: new Date(event.date),
				end: event.endDate ? new Date(event.endDate) : null,
				description: event.body,
				type: getType(event.organizers?.[0].slug ?? null, event.happeningType)
			} satisfies CalendarEvent;
		})
	);

	const isEventOnDate = (date: Date, event: CalendarEvent): boolean => {
		const start = event.start;
		const end = event.end ?? event.start;

		const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const dayStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
		const dayEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

		return day >= dayStart && day <= dayEnd;
	};
</script>

<svelte:window onresize={() => (innerWidth = window.innerWidth)} />

<div class="flex h-full flex-col gap-4">
	<div class="flex h-[50px] items-center justify-between">
		<div></div>

		<div class="flex w-fit items-center overflow-hidden rounded-full border-2 p-1">
			<button
				onclick={() => (date = subDays(date, daysVisible))}
				class="flex size-8 items-center justify-center"
			>
				<ArrowLeft class="text-muted-foreground size-4" />
			</button>
			<p class="flex h-8 items-center justify-center rounded-xl px-1 py-2 font-mono font-medium">
				{#if startWeek == endWeek}
					Uke {startWeek.toString().padStart(2, '0')}
				{:else}
					Uke {startWeek.toString().padStart(2, '0')} - {endWeek.toString().padStart(2, '0')}
				{/if}
			</p>
			<button
				onclick={() => (date = addDays(date, daysVisible))}
				class="flex size-8 items-center justify-center"
			>
				<ArrowRight class="text-muted-foreground size-4" />
			</button>

			<button
				onclick={() => {
					date = startOfWeek(TODAY);
					isDirty = false;
				}}
				class="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
				disabled={date.getTime() === startOfWeek(TODAY).getTime()}
			>
				<RotateCcw class="text-muted-foreground size-4" />
			</button>

			<div class="bg-border mx-2 h-8 w-[2px]"></div>

			{#each [1, 3, 5, 7] as day}
				<button
					onclick={() => handleChangeDaysVisible(day)}
					class={cn(
						'flex h-8 items-center justify-center rounded-full px-3 py-2 font-mono font-medium',
						{
							'bg-border': daysVisible === day
						}
					)}>{day}</button
				>
			{/each}
		</div>
	</div>

	<div
		class="bg-border grid h-full grid-cols-7 gap-[2px] overflow-hidden rounded-2xl border-2"
		style="grid-template-columns: repeat({daysVisible}, minmax(0, 1fr))"
	>
		{#each { length: daysVisible }, i}
			{@const currentDate = addDays(startDate, i)}
			{@const day = DAYS[currentDate.getDay()]}
			{@const isToday = currentDate.getDate() === TODAY.getDate()}
			{@const date = new Date(currentDate)}
			{@const formattedDate = date.toLocaleDateString('no-NO', {
				day: '2-digit',
				month: 'short'
			})}
			{@const eventsToday = calendarEvents
				.filter((event) => isEventOnDate(currentDate, event))
				.toSorted((a, b) => a.start.getTime() - b.start.getTime())}
			<div class="flex h-full flex-col">
				<div
					class="bg-muted flex h-16 flex-col items-center justify-center border-b-2 p-3 text-center font-medium"
				>
					{#if isToday}
						<p>I dag</p>
					{:else}
						<p>{day}</p>
						<p class="text-muted-foreground text-sm">
							{formattedDate}
						</p>
					{/if}
				</div>

				<div class="bg-background flex-1 px-1 py-4">
					{#each eventsToday as event}
						{@const isActive = calenderTypes.find((type) => type.type === event.type)?.active}
						{@const typeIdx = calenderTypes.findIndex((type) => type.type === event.type)}
						{#if isActive}
							<a
								href={`/arrangement/${event.slug}`}
								class={cn(
									'line-clamp-1 block w-full border-l-2 py-2 text-sm text-nowrap text-ellipsis hover:underline',
									typeColors[typeIdx].row
								)}
							>
								<span class="px-2 font-medium">{event.title}</span>
							</a>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<div class="flex h-[30px] flex-wrap items-center gap-x-2 pl-3 text-[10px] md:text-xs">
		{#each calenderTypes as type, i}
			<button
				onclick={() => (calenderTypes[i].active = !calenderTypes[i].active)}
				class={cn('flex items-center gap-1', {
					'text-muted-foreground': !type.active
				})}
			>
				<Circle
					class={cn('size-4', typeColors[i].text, {
						[typeColors[i].fill]: type.active
					})}
				/>
				{type.name}
			</button>
		{/each}
	</div>
</div>
