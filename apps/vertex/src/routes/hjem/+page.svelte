<script lang="ts">
	import EventCalendar from './_components/event-calendar.svelte';
	import UpcomingBedpres from './_components/upcoming-bedpres.svelte';
	import UpcomingEvents from './_components/upcoming-events.svelte';
	import LatestPosts from './_components/latest-posts.svelte';

	let { data } = $props();
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto gap-8 py-10 px-4 md:px-6">
	<!-- Calendar -->
	<div class="h-[400px] lg:col-span-2">
		<EventCalendar events={data.allEvents} />
	</div>

	<!-- Events -->
	<div class="rounded-2xl border-2 h-[600px] lg:h-[632px] overflow-hidden">
		<UpcomingEvents events={data.events} />
	</div>
	<div class="grid gap-8">
		<!-- Bedpresses -->
		<div class="rounded-2xl border-2 h-[300px] overflow-hidden">
			<UpcomingBedpres events={data.bedpres} />
		</div>
		<!-- Posts -->
		<div class="rounded-2xl border-2 h-[300px] overflow-hidden">
			<LatestPosts posts={data.posts} />
		</div>
	</div>

	<!-- Jobs -->
	<div class="rounded-2xl border-2 h-[300px] lg:col-span-2"></div>

	<!-- Movies -->
	<div class="rounded-2xl border-2 h-[300px]"></div>

	<!-- Shopping -->
	<div class="rounded-2xl border-2 h-[300px]"></div>
</div>
