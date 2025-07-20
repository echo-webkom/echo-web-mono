<script lang="ts">
	import EventCalendar from './_components/event-calendar.svelte';
	import UpcomingBedpres from './_components/upcoming-bedpres.svelte';
	import UpcomingEvents from './_components/upcoming-events.svelte';
	import LatestPosts from './_components/latest-posts.svelte';
	import Movies from './_components/movies.svelte';
	import ShoppingList from './_components/shopping-list.svelte';
</script>

<div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:px-6">
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Calendar -->
		<div class="h-[400px] lg:col-span-2">
			<EventCalendar />
		</div>

		<!-- Jobs Marquee -->

		<!-- Events -->
		<div class="h-[600px] overflow-hidden rounded-2xl border-2 lg:h-[632px]">
			<UpcomingEvents />
		</div>
		<div class="grid gap-8">
			<!-- Bedpresses -->
			<div class="h-[300px] overflow-hidden rounded-2xl border-2">
				<UpcomingBedpres />
			</div>
			<!-- Posts -->
			<div class="h-[300px] overflow-hidden rounded-2xl border-2">
				<LatestPosts />
			</div>
		</div>

		<!-- Movies -->
		<div class="h-[300px] overflow-hidden rounded-2xl border-2">
			<Movies />
		</div>

		<!-- Shopping -->
		<div class="h-[300px] rounded-2xl border-2">
			<ShoppingList />
		</div>
	</div>
</div>
