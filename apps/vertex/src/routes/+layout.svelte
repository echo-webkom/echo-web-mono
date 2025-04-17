<script lang="ts">
	import '../app.css';

	import { Toaster } from 'svelte-sonner';
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import FloatingFeedbackButton from '$lib/components/floating-feedback-button.svelte';
	import { ThemeState } from '$lib/state/theme.svelte';
	import { setThemeContext } from '$lib/context/color-theme';
	import { AuthState } from '$lib/state/auth.svelte';
	import { setAuthContext } from '$lib/context/auth';

	let { children, data } = $props();

	let authState = new AuthState(data.user);
	setAuthContext({
		state: authState
	});

	$effect.pre(() => {
		authState.user = data.user;
	});

	let themeState = new ThemeState();
	setThemeContext({
		state: themeState
	});
</script>

<svelte:head>
	<title>echo – Linjeforeningen for informatikk</title>
	<meta
		name="description"
		content="Nettsiden til echo – Linjeforeningen for informatikk ved Universitetet i Bergen."
	/>
</svelte:head>

<Toaster richColors closeButton bind:theme={themeState.theme} />
<FloatingFeedbackButton />

<div class="flex flex-col w-full min-h-screen">
	<Header />

	<div class="flex-1 min-h-[500px]">
		{@render children()}
	</div>

	<Footer />
</div>
