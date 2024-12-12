<script lang="ts">
	import Header from '$lib/components/header/Header.svelte';

	let { children } = $props();
</script>

<Header />
<div class="mx-auto max-w-screen-xl px-4">
	{@render children()}
</div>
