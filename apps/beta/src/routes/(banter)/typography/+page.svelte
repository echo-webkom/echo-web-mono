<script lang="ts">
	import Container from '$lib/components/ui/container.svelte';
	import Heading from '$lib/components/ui/heading.svelte';
	import Text from '$lib/components/ui/text.svelte';
	import Chip from '$lib/components/ui/chip.svelte';
</script>

<Container class="flex-col">
	<Heading size="xl">Heading (xl)</Heading>
	<Heading size="lg">Heading (lg)</Heading>
	<Heading size="md">Heading (md)</Heading>
	<Heading size="sm">Heading (sm)</Heading>
	<Heading size="xs">Heading (xs)</Heading>
	<hr />
	<Text size="xl">Text (xl)</Text>
	<Text size="lg">Text (lg)</Text>
	<Text size="md">Text (md)</Text>
	<Text size="sm">Text (sm)</Text>
	<Text size="xs">Text (xs)</Text>
	<Text intent="secondary">Text (secondary)</Text>
	<Text intent="destructive">Text (warning)</Text>
	<Text intent="warning">Text (destructive)</Text>
	<Text intent="success">Text (success)</Text>
	<Text intent="muted">Text (muted)</Text>
	<hr />
	<div class="flex items-center gap-1">
		<Chip variant="primary">Primary</Chip>
		<Chip variant="secondary">Secondary</Chip>
		<Chip variant="destructive">Destructive</Chip>
		<Chip variant="stealth">Stealth</Chip>
	</div>
</Container>
