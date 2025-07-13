<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	type Props = SVGAttributes<SVGSVGElement>;

	let { class: className, ...props }: Props = $props();
</script>

<svg
	class={['h-5 w-5 fill-current', className]}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 371.02 449"
	{...props}
>
	<rect x="322.21" y="234.2" width="48.82" height="117.17"></rect>
	<polygon
		points="209.92 268.37 161.1 268.37 161.1 400.18 48.82 400.18 48.82 234.2 0 234.2 0 409.94 0.24 409.94 0.24 449 371.02 449 371.02 400.18 209.92 400.18 209.92 268.37"
	>
	</polygon>
	<circle cx="185.51" cy="190.26" r="29.29"></circle>
	<path
		d="M185.51,48.82c75.3,0,136.56,61.26,136.56,136.56h48.82C370.89,83.16,287.73,0,185.51,0S.14,83.16.14,185.38H49C49,110.08,110.21,48.82,185.51,48.82Z"
	></path>
</svg>
