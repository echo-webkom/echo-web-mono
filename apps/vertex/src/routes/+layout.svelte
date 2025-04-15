<script lang="ts">
	import '../app.css';

	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>echo – Linjeforeningen for informatikk</title>
	<meta
		name="description"
		content="Nettsiden til echo – Linjeforeningen for informatikk ved Universitetet i Bergen."
	/>
</svelte:head>

<Header />

{@render children()}

<Footer />
