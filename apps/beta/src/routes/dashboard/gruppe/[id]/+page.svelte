<script lang="ts">
	import Heading from '$lib/components/ui/heading.svelte';
	import Container from '$lib/components/ui/container.svelte';
	import Text from '$lib/components/ui/text.svelte';

	let { data } = $props();
	let name = $derived(data.group.name);
</script>

<Container class="flex-col">
	<Heading>{name}</Heading>

	<Text>
		Velkommen til siden for administrasjon av {name}. Her kan du se hvem som er medlemmer og ledere
		av gruppen. Om du er en leder kan du også legge til og fjerne medlemmer.
	</Text>
</Container>
