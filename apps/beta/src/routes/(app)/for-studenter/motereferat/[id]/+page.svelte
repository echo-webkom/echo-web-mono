<script lang="ts">
	import ButtonLink from '$lib/components/ui/ButtonLink.svelte';

	let { data } = $props();
</script>

<h1 class="mb-4 text-2xl font-medium">{data.minute.title}</h1>

<div class="flex flex-col gap-5">
	{#if data.minute.document}
		<ButtonLink href={data.minute.document} class="w-full md:w-fit">Last ned</ButtonLink>
		<iframe title={data.minute.title} src={data.minute.document} class="h-screen w-full"></iframe>
	{:else}
		<p class="py-8 text-center text-xl font-medium">Ingen dokumenter tilgjengelig</p>
	{/if}
</div>
