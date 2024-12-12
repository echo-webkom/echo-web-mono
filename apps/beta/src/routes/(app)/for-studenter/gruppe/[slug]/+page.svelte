<script lang="ts">
	import { Facebook, Inbox, Instagram, Linkedin } from 'lucide-svelte';
	import { mailto } from '$lib/utils/prefixes';

	let { data } = $props();

	let hasSocials = $derived(Object.values(data.group.socials ?? {}).filter(Boolean).length > 0);
</script>

<h1 class="mb-8 text-3xl font-medium">{data.group.name}</h1>

{#if hasSocials}
	<section class="flex items-center gap-4">
		{#if data.group.socials?.email}
			<a href={mailto(data.group.socials.email)} class="flex items-center gap-2 hover:underline">
				<span>
					<Inbox class="h-6 w-6" />
				</span>
				<span>E-post</span>
			</a>
		{/if}
		{#if data.group.socials?.facebook}
			<a href={data.group.socials.facebook} class="flex items-center gap-2 hover:underline">
				<span>
					<Facebook class="h-6 w-6" />
				</span>
				<span>Facebook</span>
			</a>
		{/if}
		{#if data.group.socials?.instagram}
			<a href={data.group.socials.instagram} class="flex items-center gap-2 hover:underline">
				<span>
					<Instagram className="h-6 w-6" />
				</span>
				<span>Instagram</span>
			</a>
		{/if}
		{#if data.group.socials?.linkedin}
			<a href={data.group.socials.linkedin} class="flex items-center gap-2 hover:underline">
				<span>
					<Linkedin class="h-6 w-6" />
				</span>
				<span>LinkedIn</span>
			</a>
		{/if}
	</section>
{/if}

{#if data.photo}
	<div class="mx-auto w-fit">
		<img src={data.photo} alt={data.group.name} class="h-[600px] rounded-lg border-2" />
	</div>
{/if}

<section>
	<article class="prose-base prose-a:text-blue-500 hover:prose-a:underline max-w-full py-4">
		{@html data.content}
	</article>
</section>

{#if data.group.members}
	<section>
		<h2 class="mb-4 text-2xl font-medium">Medlemmer</h2>

		<div class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
			{#each data.group.members as member}
				<div class="group flex flex-col gap-2 p-5 text-center">
					<p>{member.profile?.name}</p>
					<p>{member.role}</p>
				</div>
			{/each}
		</div>
	</section>
{/if}
