<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import { getAuthContext } from '$lib/context/auth';
	import { initials } from '$lib/initials';

	let auth = getAuthContext();
</script>

<Container class="flex-col max-w-4xl">
	<Heading>Din profil</Heading>

	<p>Her kan du se og redigere din profil.</p>

	<div class="flex flex-col gap-6 md:flex-row">
		<div class="space-y-2">
			<span class="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full border-2">
				{#if auth.state.user?.image}
					<img
						alt={auth.state.user!.name!}
						class="aspect-square h-full w-full object-cover"
						src={auth.state.user!.image}
					/>
				{:else}
					<span class="mx-auto my-auto text-2xl">
						{initials(auth.state.user!.name!)}
					</span>
				{/if}
			</span>
			<div>
				<input accept="image/png,image/jpeg,image/jpg,image/gif" hidden="" type="file" /><button
					type="button"
					class="w-fit text-red-600 hover:underline md:w-full md:text-center">Fjern bilde</button
				>
			</div>
		</div>
		<div>
			<div>
				<span
					class="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>Navn</span
				>
				<p class="break-words py-1 text-lg">{auth.state.user!.name!}</p>
			</div>
			<div>
				<span
					class="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>E-post</span
				>
				<p class="break-words py-1 text-lg">{auth.state.user!.email}</p>
			</div>
		</div>
	</div>
</Container>
