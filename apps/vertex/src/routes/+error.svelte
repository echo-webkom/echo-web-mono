<script lang="ts">
	import { page } from '$app/state';

	let status = $derived(page.status);
</script>

<main class="mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8 max-w-[1200px] mb-20">
	<div class="mb-24 mt-32 space-y-16">
		<div class="mx-auto max-w-screen-md text-center">
			<h1 class="text-5xl mb-8 font-semibold text-gray-700 dark:text-gray-200 sm:text-5xl">
				{status}
			</h1>
			<p class="mx-auto max-w-screen-md font-medium text-muted-foreground md:text-xl">
				Beklager, vi fant ikke siden du lette etter.
			</p>
		</div>
	</div>
</main>
