<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../ui/Button.svelte';
</script>

<form method="post" action="/auth/logg-ut" use:enhance>
	<Button>Logg ut</Button>
</form>
