<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<article class="prose py-8">
	<h1>{data.title}</h1>
	{@html data.content}
</article>
