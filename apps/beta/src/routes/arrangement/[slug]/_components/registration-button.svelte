<script lang="ts">
	import type { PageData } from '../$types';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';
	import Dialog from '$lib/components/ui/dialog/dialog.svelte';
	import Label from '$lib/components/ui/form/label.svelte';
	import Input from '$lib/components/ui/form/input.svelte';
	import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
	import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
	import DialogSeperator from '$lib/components/ui/dialog/dialog-seperator.svelte';
	import DialogFooter from '$lib/components/ui/dialog/dialog-footer.svelte';
	import { toast } from 'svelte-sonner';
	import Textarea from '$lib/components/ui/form/textarea.svelte';
	import Checkbox from '$lib/components/ui/form/checkbox.svelte';
	import Radio from '$lib/components/ui/form/radio.svelte';
	import { DialogState } from '$lib/state/dialog.svelte';

	let data = $derived(page.data as PageData);
	let dialog = new DialogState();

	const handleRegistration = () => {
		toast.info('Påmelding er enda implementert :)', {
			position: 'top-center'
		});
	};
</script>

{#if data.event.additionalQuestions}
	<Button onclick={dialog.open} variant="secondary" class="mt-4 w-full">Fyll ut spørsmål</Button>
{:else}
	<Button onclick={handleRegistration} variant="secondary" class="mt-4 w-full">Meld deg på</Button>
{/if}

<Dialog bind:open={dialog.isOpen}>
	<DialogContent>
		<DialogTitle>Fyll ut spørsmålene</DialogTitle>
		<DialogSeperator />
		<div class="flex max-h-[400px] flex-col overflow-y-auto px-4 pb-4">
			<form class="mt-4 flex flex-col gap-6">
				{#each data.event.additionalQuestions ?? [] as question}
					{#if question.type === 'text'}
						<div class="flex flex-col gap-1">
							<Label class="text-sm" for={question.title} required={question.required}>
								{question.title}
							</Label>
							<Input
								type="text"
								placeholder="Fyll her..."
								id={question.title}
								name={question.title}
								required={question.required}
							/>
						</div>
					{/if}

					{#if question.type === 'textarea'}
						<div class="flex flex-col gap-1">
							<Label class="text-sm" for={question.title} required={question.required}>
								{question.title}
							</Label>
							<Textarea
								id={question.title}
								name={question.title}
								rows={4}
								placeholder="Fyll her..."
								required={question.required}
							/>
						</div>
					{/if}

					{#if question.type === 'checkbox'}
						<div class="flex flex-col gap-1">
							<Label class="text-sm" for={question.title} required={question.required}>
								{question.title}
							</Label>
							{#each question.options ?? [] as option}
								<div class="flex items-center gap-2">
									<Checkbox
										id={option}
										name={question.title}
										value={option}
										required={question.required}
									/>
									<Label for={option}>{option}</Label>
								</div>
							{/each}
						</div>
					{/if}

					{#if question.type === 'radio'}
						<div class="flex flex-col gap-1">
							<Label class="text-sm" for={question.title} required={question.required}>
								{question.title}
							</Label>
							{#each question.options ?? [] as option}
								<div class="flex items-center gap-2">
									<Radio
										id={option}
										name={question.title}
										value={option}
										required={question.required}
									/>
									<Label for={option}>{option}</Label>
								</div>
							{/each}
						</div>
					{/if}
				{/each}
			</form>
		</div>
		<DialogFooter>
			<Button
				type="button"
				onclick={handleRegistration}
				form="registration-form"
				variant="secondary"
				class="w-full"
			>
				Registrer deg
			</Button>
			<Button variant="danger" onclick={dialog.close} class="w-full">Lukk</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
