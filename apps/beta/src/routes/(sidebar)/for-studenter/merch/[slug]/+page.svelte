<script lang="ts">
	import { urlFor } from '$lib/sanity/image';
	import Heading from '$lib/components/ui/heading.svelte';

	let { data } = $props();
</script>

<section class="mx-auto max-w-5xl px-6 py-12">
	<div class="flex flex-col items-center gap-10 md:flex-row md:items-start">
		<!-- 🖼️ Image Section -->
		<div class="block w-full max-w-full flex-shrink-0 md:w-[300px]">
			<img
				alt={data.merch.title}
				src={urlFor(data.merch.image).url()}
				class="h-auto max-h-[400px] w-full rounded-xl border border-gray-300 object-cover shadow-md"
			/>
		</div>

		<!-- 📦 Info Section -->
		<div class="flex-1 text-center md:text-left">
			<Heading class="mb-4 text-4xl font-bold">{data.merch.title}</Heading>

			<p class="mb-2 text-lg font-semibold">
				Pris:
				<span class="text-primary text-xl">{data.merch.price} kr</span>
			</p>

			<p class="text-md mb-6 font-medium">
				Send mail til
				<a href="mailto:echo@uib.no" class="text-blue-600 underline transition hover:text-blue-800"
					>echo@uib.no</a
				>
				for kjøp
			</p>

			<a
				href="mailto:echo@uib.no?subject=Kjøp%20av%20{encodeURIComponent(data.merch.title)}"
				class="btn-primary"
			>
				Send forespørsel
			</a>
		</div>
	</div>
</section>
