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
		'flex size-4 items-center justify-center rounded-md border-2',
		'transition duration-200 ease-in-out',
		'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
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
			<Minus class="size-4 stroke-3" />
		{:else if checked}
			<Check class="size-4 stroke-3" />
		{/if}
	{/snippet}
</Checkbox.Root>

{#if name}
	<input type="hidden" {name} value={checked ? 'on' : 'off'} />
{/if}
