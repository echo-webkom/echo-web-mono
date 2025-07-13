<script lang="ts">
	import '../app.css';

	import { Tooltip } from 'bits-ui';
	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import FloatingFeedbackButton from '$lib/components/floating-feedback-button.svelte';
	import { ThemeState } from '$lib/state/theme.svelte';
	import { setThemeContext } from '$lib/context/color-theme';
	import { AuthContext } from '$lib/context/auth';
	import Progress from '$lib/components/layout/progress.svelte';

	let { children, data } = $props();

	let auth = $state({
		user: data.user
	});
	AuthContext.set(auth);

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

<Progress />

<Tooltip.Provider>
	<Toaster richColors closeButton bind:theme={theme.current} />
	<FloatingFeedbackButton />

	<div class="flex min-h-screen w-full flex-col">
		<Header />

		<div class="min-h-[500px] flex-1">
			{@render children()}
		</div>

		<Footer />
	</div>
</Tooltip.Provider>
