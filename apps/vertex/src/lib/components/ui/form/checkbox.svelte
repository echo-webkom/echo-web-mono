<script lang="ts">
	import { Checkbox, useId, type WithoutChildrenOrChild } from 'bits-ui';
	import { Check, Minus } from '@lucide/svelte';
	import { cn } from '$lib/cn';

	let {
		id: propId,
		class: className,
		name,
		checked = $bindable(false),
		ref = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Checkbox.RootProps> = $props();
	const id = propId ?? name ?? useId();
</script>

<Checkbox.Root
	{id}
	class={cn(
		'rounded-md size-5 border flex border-primary items-center justify-center',
		{
			'bg-primary text-primary-foreground border-transparent': checked
		},
		className
	)}
	bind:checked
	bind:ref
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		{#if indeterminate}
			<Minus class="size-4" />
		{:else if checked}
			<Check class="size-4" />
		{/if}
	{/snippet}
</Checkbox.Root>

{#if name}
	<input type="hidden" {name} value={checked ? 'on' : 'off'} />
{/if}
