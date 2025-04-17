<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import Container from '$lib/components/ui/container.svelte';
	import Label from '$lib/components/ui/form/label.svelte';
	import Input from '$lib/components/ui/form/input.svelte';
	import Textarea from '$lib/components/ui/form/textarea.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/cn';

	let { form } = $props();

	let isLoading = $state(false);
</script>

<Container class="max-w-5xl">
	<div class="grid grid-cols-1 gap-10 md:grid-cols-2">
		<div class="space-y-2">
			<Heading>Send inn tilbakemelding</Heading>
			<p class="break-words py-1 text-lg">
				Din tilbakemelding betyr mye for oss. Gjerne fortell oss hva du ønsker å se på nettsiden
				eller hva vi kan gjøre bedre. Alternativt kan du også opprette en issue på GitHub for å
				rapportere en feil.
			</p>
		</div>

		<form
			class="space-y-4"
			method="post"
			use:enhance={() => {
				isLoading = true;
				return async ({ update, result }) => {
					await update();
					isLoading = false;

					if (form?.message) {
						if (result.type === 'success') {
							toast.success(form.message);
						} else {
							toast.error(form.message);
						}
					}
				};
			}}
		>
			<div class="flex flex-col gap-3">
				<div class="space-y-2">
					<Label for="email">E-post</Label>
					<Input id="email" placeholder="Din e-post" name="email" />
				</div>
				<div class="space-y-2">
					<Label for="name">Navn</Label>
					<Input id="name" placeholder="Ditt navn" name="name" />
				</div>
				<div class="space-y-2">
					<Label for="message" required>Tilbakemelding</Label>
					<Textarea id="message" placeholder="Din tilbakemelding" name="message"></Textarea>
				</div>
			</div>
			<p>
				<small
					>Feltene for navn og e-post er ikke påkrevd, men fylles ut dersom du tillater at vi
					kontakter deg om tilbakemeldingen.</small
				>
			</p>
			<button
				class={cn(
					'inline-flex items-center font-semibold justify-center rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background duration-300 bg-primary border-primary-dark text-primary-foreground hover:bg-primary-hover h-10 py-2 px-4 w-full sm:w-auto',
					{
						'opacity-50 cursor-not-allowed': isLoading
					}
				)}
				type="submit"
			>
				Send
			</button>
		</form>
	</div>
</Container>
