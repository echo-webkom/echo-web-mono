<script lang="ts">
	import EventCalendar from './_components/event-calendar.svelte';
	import UpcomingBedpres from './_components/upcoming-bedpres.svelte';
	import UpcomingEvents from './_components/upcoming-events.svelte';
	import LatestPosts from './_components/latest-posts.svelte';
	import Movies from './_components/movies.svelte';
	import ShoppingList from './_components/shopping-list.svelte';
</script>

<div class="flex flex-col max-w-7xl gap-8 mx-auto py-10 px-4 md:px-6">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Calendar -->
		<div class="h-[400px] lg:col-span-2">
			<EventCalendar />
		</div>

		<!-- Jobs Marquee -->

		<!-- Events -->
		<div class="rounded-2xl border-2 h-[600px] lg:h-[632px] overflow-hidden">
			<UpcomingEvents />
		</div>
		<div class="grid gap-8">
			<!-- Bedpresses -->
			<div class="rounded-2xl border-2 h-[300px] overflow-hidden">
				<UpcomingBedpres />
			</div>
			<!-- Posts -->
			<div class="rounded-2xl border-2 h-[300px] overflow-hidden">
				<LatestPosts />
			</div>
		</div>

		<!-- Movies -->
		<div class="rounded-2xl border-2 h-[300px] overflow-hidden">
			<Movies />
		</div>

		<!-- Shopping -->
		<div class="rounded-2xl border-2 h-[300px]">
			<ShoppingList />
		</div>
	</div>
</div>
