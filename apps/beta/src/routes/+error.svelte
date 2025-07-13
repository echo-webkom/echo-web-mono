<script lang="ts">
	import { page } from '$app/state';

	let status = $derived(page.status);
</script>

<main class="mx-auto mb-20 flex w-full max-w-[1200px] flex-col px-4 sm:px-6 lg:px-8">
	<div class="mt-32 mb-24 space-y-16">
		<div class="mx-auto max-w-screen-md text-center">
			<h1 class="mb-8 text-5xl font-semibold text-gray-700 sm:text-5xl dark:text-gray-200">
				{status}
			</h1>
			<p class="text-muted-foreground mx-auto max-w-screen-md font-medium md:text-xl">
				Beklager, vi fant ikke siden du lette etter.
			</p>
		</div>
	</div>
</main>
