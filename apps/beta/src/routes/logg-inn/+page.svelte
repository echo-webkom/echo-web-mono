<script lang="ts">
	import echo from '$lib/assets/images/echo-logo.png';
	import Feide from '$lib/components/icons/feide.svelte';
</script>

<div class="mx-4 my-14 flex flex-col gap-4">
	<div
		class="border-muted-dark bg-muted mx-auto flex w-full max-w-[380px] flex-col rounded-xl border-2 p-8"
	>
		<img src={echo} alt="echo logo" width="100" height="100" class="mx-auto" />

		<h3 class="group mx-auto mb-8 flex items-center text-xl font-semibold tracking-tight">
			Velg en måte å logge inn
		</h3>

		<div class="mb-4 flex flex-col justify-center gap-3">
			<div>
				<a
					href="/auth/feide"
					class="focus-visible:ring-ring ring-offset-background text-primary-foreground group border-feide-dark bg-feide hover:border-feide hover:bg-feide-hover inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-2 font-semibold transition-colors duration-300 hover:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
				>
					<Feide /> Logg inn med Feide
				</a>
			</div>
		</div>

		<p class="text-muted-foreground py-1 text-sm break-words">
			For å kunne logge inn må du være medlem av echo. <a
				class="underline"
				href="/om/vedtekter#§-2-medlemmer">Les mer her.</a
			>
		</p>
	</div>
</div>
