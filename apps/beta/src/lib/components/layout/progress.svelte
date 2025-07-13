<script lang="ts">
	import 'nprogress/nprogress.css';
	import NProgress from 'nprogress';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	NProgress.configure({
		minimum: 0.2,
		showSpinner: false
	});

	beforeNavigate(() => {
		NProgress.start();
	});

	afterNavigate(() => {
		NProgress.done();
	});
</script>

<style>
	:global(#nprogress .bar) {
		background: var(--color-secondary) !important;
		height: 4px !important;
	}
</style>
