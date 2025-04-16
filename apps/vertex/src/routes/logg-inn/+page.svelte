<script lang="ts">
	import echo from '$lib/assets/images/echo-logo.png';
	import Feide from '$lib/components/icons/feide.svelte';
</script>

<div class="mx-4 my-14 flex flex-col gap-4">
	<div
		class="mx-auto flex w-full max-w-[380px] flex-col rounded-xl border-2 border-muted-dark bg-muted p-8"
	>
		<img src={echo} alt="echo logo" width="100" height="100" class="mx-auto" />

		<h3 class="group flex items-center font-semibold tracking-tight text-xl mx-auto mb-8">
			Velg en måte å logge inn
		</h3>

		<div class="mb-4 flex flex-col justify-center gap-3">
			<div>
				<button
					class="inline-flex items-center font-semibold justify-center rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background duration-300 text-primary-foreground h-10 py-2 px-4 group w-full gap-2 border-feide-dark bg-feide hover:border-feide hover:bg-feide-hover hover:text-black"
					type="button"
				>
					<Feide /> Logg inn med Feide
				</button>
			</div>
		</div>

		<p class="break-words py-1 text-sm text-muted-foreground">
			For å kunne logge inn må du være medlem av echo. <a
				class="underline"
				href="/om/vedtekter#§-2-medlemmer">Les mer her.</a
			>
		</p>
	</div>
</div>
