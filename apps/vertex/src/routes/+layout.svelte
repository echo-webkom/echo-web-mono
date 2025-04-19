<script lang="ts">
	import '../app.css';

	import { Tooltip } from 'bits-ui';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import FloatingFeedbackButton from '$lib/components/floating-feedback-button.svelte';
	import { ThemeState } from '$lib/state/theme.svelte';
	import { setThemeContext } from '$lib/context/color-theme';
	import { setAuthContext } from '$lib/context/auth';

	let { children, data } = $props();

	let auth = $state({
		user: data.user
	});
	setAuthContext(auth);

	$effect.pre(() => {
		auth.user = data.user;
	});

	let theme = new ThemeState();
	setThemeContext(theme);
</script>

<svelte:head>
	<title>echo – Linjeforeningen for informatikk</title>
	<meta
		name="description"
		content="Nettsiden til echo – Linjeforeningen for informatikk ved Universitetet i Bergen."
	/>
</svelte:head>

<Tooltip.Provider>
	<Toaster richColors closeButton bind:theme={theme.current} />
	<FloatingFeedbackButton />

	<div class="flex flex-col w-full min-h-screen">
		<Header />

		<div class="flex-1 min-h-[500px]">
			{@render children()}
		</div>

		<Footer />
	</div>
</Tooltip.Provider>
