<script lang="ts">
	import '../app.css';

	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import FloatingFeedbackButton from '$lib/components/floating-feedback-button.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>echo – Linjeforeningen for informatikk</title>
	<meta
		name="description"
		content="Nettsiden til echo – Linjeforeningen for informatikk ved Universitetet i Bergen."
	/>
</svelte:head>

<div class="flex flex-col w-full min-h-screen">
	<Header />

	<div class="flex-1 min-h-[500px]">
		{@render children()}
	</div>

	<FloatingFeedbackButton />
	<Footer />
</div>
