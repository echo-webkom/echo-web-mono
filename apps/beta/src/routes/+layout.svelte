<script lang="ts">
	import '../app.css';
	import { writable } from 'svelte/store';
	import { setUserContext } from '$lib/context/user.context';

	let { data, children } = $props();

	const user = writable(data.user);
	$effect.pre(() => {
		user.set(data.user);
	});
	setUserContext(user);
</script>

{@render children()}
