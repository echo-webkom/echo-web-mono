<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { type Snippet } from 'svelte';

	type Props = Tooltip.RootProps & {
		trigger: Snippet;
		triggerProps?: Tooltip.TriggerProps;
	};

	let {
		trigger,
		open = $bindable(false),
		children,
		triggerProps = {},
		...restProps
	}: Props = $props();
</script>

<Tooltip.Root bind:open {...restProps}>
	<Tooltip.Trigger {...triggerProps}>
		{@render trigger()}
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content
			class="border-primary-dark bg-primary text-primary-foreground rounded-2xl border-2 px-3 py-1 text-sm font-medium"
		>
			<Tooltip.Arrow class="text-primary-dark" />
			{@render children?.()}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
