<script lang="ts">
	import { page } from '$app/state';
	import { urlFor } from '$lib/sanity/image';
	import { format } from 'date-fns';
	import type { PageData } from '../$types';
	import { nb } from 'date-fns/locale';

	let data = $derived(page.data as PageData);
	let movies = $derived(data.movies);

	let movie1 = $derived(movies[0]);
	let movie2 = $derived(movies[1]);
	let movie3 = $derived(movies[2]);

	const formatDate = (date: string) => {
		const parsedDate = new Date(date);
		return format(parsedDate, 'dd. MMMM', { locale: nb });
	};
</script>

<div class="flex items-center justify-center gap-4 overflow-hidden">
	<a href={movie1.link} class="group relative block shrink-0">
		<img
			src={urlFor(movie1.image).url()}
			alt={movie1.title}
			class="w-full h-[300px] object-contain"
		/>

		<div
			class="absolute p-2 bottom-0 -translate-y-1 w-full h-[100px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
		>
			<div class="bg-muted rounded-2xl border-2 flex flex-col items-center justify-center h-full">
				<h3 class="text-muted-foreground text-lg font-semibold">{movie1.title}</h3>
				<p class="text-sm text-muted-foreground">
					{formatDate(movie1.date)}
				</p>
			</div>
		</div>
	</a>

	{#if movie2}
		<div class="flex flex-col">
			<a href={movie2.link} class="relative">
				<img
					src={urlFor(movie2.image).url()}
					alt={movie2.title}
					class="w-full h-[150px] object-contain"
				/>

				<div class="absolute p-2 bottom-0 -translate-y-1 w-full h-[50px] z-10">
					<div
						class="bg-muted/70 rounded-lg border-2 flex flex-col items-center justify-center h-full"
					>
						<p class="text-sm text-muted-foreground">
							{formatDate(movie2.date)}
						</p>
					</div>
				</div>
			</a>

			{#if movie3}
				<a href={movie3.link} class="relative">
					<img
						src={urlFor(movie3.image).url()}
						alt={movie3.title}
						class="w-full h-[150px] object-contain"
					/>

					<div class="absolute p-2 bottom-0 -translate-y-1 w-full h-[50px] z-10">
						<div
							class="bg-muted rounded-lg border-2 flex flex-col items-center justify-center h-full"
						>
							<p class="text-sm text-muted-foreground">
								{formatDate(movie3.date)}
							</p>
						</div>
					</div>
				</a>
			{/if}
		</div>
	{/if}
</div>
