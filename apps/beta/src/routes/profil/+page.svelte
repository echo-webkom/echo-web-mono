<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import Avatar from '$lib/components/ui/avatar.svelte';
	import Checkbox from '$lib/components/ui/form/checkbox.svelte';
	import { AuthContext } from '$lib/context/auth';
	import { initials } from '$lib/strings.js';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Select from '$lib/components/ui/form/select.svelte';
	import Label from '$lib/components/ui/form/label.svelte';
	import Input from '$lib/components/ui/form/input.svelte';
	import Chip from '$lib/components/ui/chip.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { format } from 'date-fns';

	let { data } = $props();

	let auth = AuthContext.get();

	let degrees = $derived(data.degrees);
	let isLoading = $state(false);
	let imageInput = $state<HTMLInputElement | null>(null);
	let imageForm = $state<HTMLFormElement | null>(null);
	let alternativeEmail = $derived<string>(data.user?.alternativeEmail ?? '');
	let degree = $derived<string>(data.user?.degree?.id ?? '');
	let year = $derived(data.user?.year ? data.user.year : '');
	let birthday = $derived<string>(
		data.user?.birthday ? format(new Date(data.user.birthday), 'yyyy-MM-dd') : ''
	);
	let hasReadTerms = $derived<boolean>(data.user?.hasReadTerms ?? false);

	const handleFileUpload = async () => {
		if (!imageInput?.files || imageInput.files.length < 1) return;

		const file = imageInput.files[0];
		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch('/upload-image', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			invalidateAll();
			toast.success('Bilde er lastet opp!');
		} else {
			const json = await response.json();
			if ('message' in json && typeof json.message === 'string') {
				toast.error(json.message);
			} else {
				toast.error('Noe gikk galt. Prøv igjen senere.');
			}
		}
	};
</script>

<Container class="max-w-3xl flex-col">
	<Heading>Din profil</Heading>

	<div class="flex flex-col gap-6 md:flex-row">
		<div class="space-y-2">
			<Avatar
				src={auth.user!.image ?? ''}
				alt={auth.user!.name ?? 'Profilbilde'}
				class="size-24 text-xl"
				fallback={initials(auth.user!.name!)}
			/>

			<div>
				{#if auth.user!.image}
					<form method="post" action="?/removeImage" use:enhance>
						<button class="w-fit text-red-600 hover:underline md:w-full md:text-center"
							>Fjern bilde</button
						>
					</form>
				{:else}
					<form bind:this={imageForm}>
						<input
							bind:this={imageInput}
							accept="image/png,image/jpeg,image/jpg,image/gif"
							hidden
							type="file"
							name="file"
							onchange={handleFileUpload}
						/>

						<button
							onclick={() => imageInput?.click()}
							type="button"
							class="w-fit text-blue-600 hover:underline md:w-full md:text-center"
						>
							Last opp
						</button>
					</form>
				{/if}
			</div>
		</div>
		<div>
			<div>
				<span
					class="text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>Navn</span
				>
				<p class="py-1 text-lg break-words">{auth.user!.name!}</p>
			</div>
			<div>
				<span
					class="text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>E-post</span
				>
				<p class="py-1 text-lg break-words">{auth.user!.email}</p>
			</div>
		</div>
	</div>

	{#if data.user!.memberships.length > 0}
		<div>
			<Heading as="h3" size="xs">Grupper</Heading>
			<div>
				{#each data.user!.memberships as membership}
					<a href="/dashboard/gruppe/{membership.id}">
						<Chip variant="secondary">{membership.group}</Chip>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<form
		action="?/updateProfile"
		method="post"
		class="space-y-4"
		use:enhance={() => {
			isLoading = true;
			return async ({ update, result }) => {
				await update();
				isLoading = false;
				const wasSuccess = result.type === 'success';
				if (!wasSuccess) {
					toast.error('Noe gikk galt. Prøv igjen senere.');
					return;
				}
				toast.success('Brukeren ble oppdatert');
			};
		}}
	>
		<div class="space-y-2">
			<Label for="alternativeEmail">Alternativ e-post</Label>
			<Input
				id="alternativeEmail"
				placeholder="Din e-post"
				name="alternativeEmail"
				bind:value={alternativeEmail}
			/>
			<p class="text-muted-foreground text-sm">Om du ønsker å få e-post tilsendt en annen mail.</p>
		</div>
		<div class="space-y-2">
			<Label for="degree"><span>Studieretning</span></Label>
			<Select id="degree" name="degree" bind:value={degree}>
				<option value="" disabled>Velg studieretning</option>
				{#each degrees as degree}
					<option value={degree.id} selected={degree.id === auth.user?.degree?.id}
						>{degree.name}</option
					>
				{/each}
			</Select>
		</div>
		<div class="space-y-2">
			<Label for="year">Årstrinn</Label>
			<Select id="year" name="year" bind:value={year}>
				<option value="" disabled>Velg årstrinn</option>

				{#each { length: 6 }, year}
					{#if year === 5}
						<option value={year + 1}>PhD</option>
					{:else}
						<option value={year + 1}>{year + 1}. året</option>
					{/if}
				{/each}
			</Select>
		</div>
		<div class="space-y-2">
			<Label for="birthday">Bursdag</Label>
			<Input id="birthday" type="date" bind:value={birthday} name="birthday" />
			<p class="text-muted-foreground text-sm">
				Legg til bursdagen din, og få den vist på echoscreen i lesesalen!🎉
			</p>
		</div>
		<div class="flex items-center space-x-3">
			<Checkbox id="hasReadTerms" name="hasReadTerms" bind:checked={hasReadTerms} />

			<div class="leading-none">
				<Label for="hasReadTerms">
					Jeg bekrefter at jeg har lest <a
						class="font-medium underline transition-colors duration-200 after:content-['_↗'] hover:text-blue-500"
						href="/om/retningslinjer">de etiske retnlingslinjene</a
					>
					.
				</Label>
			</div>
		</div>
		<div>
			<Button class="w-24" type="submit" loading={isLoading}>
				{#if isLoading}
					Lagrer...
				{:else}
					Lagre
				{/if}
			</Button>
		</div>
	</form>
</Container>
