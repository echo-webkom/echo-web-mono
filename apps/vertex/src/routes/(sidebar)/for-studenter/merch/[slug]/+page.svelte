<script lang="ts">
	import { urlFor } from '$lib/sanity/image';
	import Heading from '$lib/components/ui/heading.svelte';

	let { data } = $props();
</script>

<section class="max-w-5xl mx-auto px-6 py-12">
	<div class="flex flex-col md:flex-row items-center md:items-start gap-10">
		<!-- 🖼️ Image Section -->
		<div class="w-full md:w-[300px] max-w-full block flex-shrink-0">
			<img
				alt={data.merch.title}
				src={urlFor(data.merch.image).url()}
				class="rounded-xl border border-gray-300 shadow-md object-cover w-full h-auto max-h-[400px]"
			/>
		</div>

		<!-- 📦 Info Section -->
		<div class="flex-1 text-center md:text-left">
			<Heading class="text-4xl font-bold mb-4">{data.merch.title}</Heading>

			<p class="text-lg font-semibold mb-2">
				Pris:
				<span class="text-primary text-xl">{data.merch.price} kr</span>
			</p>

			<p class="text-md font-medium mb-6">
				Send mail til
				<a href="mailto:echo@uib.no" class="underline text-blue-600 hover:text-blue-800 transition"
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
