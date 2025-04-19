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
			class="border-2 border-primary-dark bg-primary py-1 font-medium px-3 rounded-2xl text-primary-foreground text-sm"
		>
			<Tooltip.Arrow class="text-primary-dark" />
			{@render children?.()}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
