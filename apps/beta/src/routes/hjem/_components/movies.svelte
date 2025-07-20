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
	{#if movie1}
		<a href={movie1.link} class="group relative block shrink-0">
			<img
				src={urlFor(movie1.image).url()}
				alt={movie1.title}
				class="h-[300px] w-full object-contain"
			/>

			<div
				class="absolute bottom-0 z-10 h-[100px] w-full -translate-y-1 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			>
				<div class="bg-muted flex h-full flex-col items-center justify-center rounded-2xl border-2">
					<h3 class="text-muted-foreground text-lg font-semibold">{movie1.title}</h3>
					<p class="text-muted-foreground text-sm">
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
						class="h-[150px] w-full object-contain"
					/>

					<div class="absolute bottom-0 z-10 h-[50px] w-full -translate-y-1 p-2">
						<div
							class="bg-muted/70 flex h-full flex-col items-center justify-center rounded-lg border-2"
						>
							<p class="text-muted-foreground text-sm">
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
							class="h-[150px] w-full object-contain"
						/>

						<div class="absolute bottom-0 z-10 h-[50px] w-full -translate-y-1 p-2">
							<div
								class="bg-muted flex h-full flex-col items-center justify-center rounded-lg border-2"
							>
								<p class="text-muted-foreground text-sm">
									{formatDate(movie3.date)}
								</p>
							</div>
						</div>
					</a>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="flex h-[300px] w-full items-center justify-center rounded-2xl border-2">
			<p class="text-muted-foreground">Ingen filmer tilgjengelig</p>
		</div>
	{/if}
</div>
