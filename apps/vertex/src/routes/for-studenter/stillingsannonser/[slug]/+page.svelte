<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import Markdown from '$lib/components/ui/markdown.svelte';
	import { degreeYearText, degreeYearsToList } from '$lib/degree-year-text.js';
	import { urlFor } from '$lib/sanity';
	import { JOB_TYPES } from '@echo-webkom/lib';
	import { format } from 'date-fns';
	import { nb } from 'date-fns/locale';

	let { data } = $props();
</script>

<Container class="flex-col">
	<a class="hover:underline" href="/for-studenter/stillingsannonser"
		>← Tilbake til alle stillingsannonser</a
	>

	<div class="flex flex-col-reverse gap-16 md:flex-row">
		<div>
			<Heading class="mb-4">
				{data.job.title}
			</Heading>
			<Markdown markdown={data.job.body} />
		</div>

		<div
			class="rounded-xl border-2 border-muted-dark bg-muted p-6 flex h-fit w-full flex-col gap-4 lg:max-w-[360px]"
		>
			<div>
				<a href="https://www.uib.no"
					><div class="overflow-hidden rounded-xl border-2 bg-white">
						<div class="relative aspect-square w-full">
							<img
								alt="{data.job.company.name} logo"
								src={urlFor(data.job.company.image).url()}
								class="h-full w-full object-cover"
							/>
						</div>
					</div></a
				>
			</div>
			<div>
				<h3 class="text-lg font-semibold">Bedrift</h3>
				<div>
					<a class="hover:underline" href="https://www.uib.no">{data.job.company.name}</a>
				</div>
			</div>
			<div>
				<h3 class="text-lg font-semibold">Sted</h3>
				<div>{data.job.locations.map((location) => location.name).join(', ')}</div>
			</div>
			<div>
				<h3 class="text-lg font-semibold">Søknadsfrist</h3>
				<p>{format(data.job.expiresAt, 'dd.MM.yyyy', { locale: nb })}</p>
			</div>
			<div>
				<h3 class="text-lg font-semibold">Årstrinn</h3>
				<div>{degreeYearText(degreeYearsToList(data.job.degreeYears))}</div>
			</div>
			<div>
				<h3 class="text-lg font-semibold">Stillingstype</h3>
				<div>{JOB_TYPES.find((jt) => jt.value === data.job.jobType)?.title}</div>
			</div>
			<div>
				<a
					class="inline-flex items-center font-semibold justify-center rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background duration-300 bg-primary border-primary-dark text-primary-foreground hover:bg-primary-hover h-10 py-2 px-4 w-full hover:underline"
					type="button"
					href={data.job.link}>Søk her!</a
				>
			</div>
		</div>
	</div>
</Container>
