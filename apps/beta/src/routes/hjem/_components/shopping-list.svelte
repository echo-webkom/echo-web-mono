<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';
	import { Heart } from '@lucide/svelte';
	import type { PageData } from '../$types';
	import { cn } from '$lib/cn';
	import { enhance } from '$app/forms';
	import { AuthContext } from '$lib/context/auth';

	let data = $derived(page.data as PageData);
	// svelte-ignore state_referenced_locally
	let shoppingList = $state(data.shoppingList.slice(0, 4));
	let sortedList = $derived(shoppingList.toSorted((a, b) => b.likes.length - a.likes.length));
	let auth = AuthContext.get();
</script>

<div class="flex h-full flex-col gap-4 p-4">
	<div class="h-full rounded-xl border-2 p-4">
		{#if shoppingList.length > 0}
			<ul>
				{#each sortedList as item}
					{@const hasLiked = auth.user?.id && item.likes.includes(auth.user.id)}
					<li class="flex items-center justify-between">
						<p>
							{item.name}
						</p>

						<div class="flex items-center gap-3">
							<span class="text-muted-foreground">{item.likes.length}</span>
							<form
								class="flex items-center"
								action="?/like"
								method="post"
								use:enhance={() => {
									shoppingList = shoppingList.map((i) => {
										if (i.id === item.id) {
											if (hasLiked) {
												return { ...i, likes: i.likes.filter((l) => l !== auth.user!.id) };
											}
											return { ...i, likes: [...i.likes, auth.user!.id] };
										}
										return i;
									});
								}}
							>
								<input type="hidden" name="id" value={item.id} />
								<button class="group cursor-pointer">
									<Heart
										class={cn(
											'text-muted-foreground size-5 transition-all group-hover:fill-red-300 group-hover:text-red-600 active:scale-95',
											{
												'fill-red-500 text-red-500': hasLiked
											}
										)}
									/>
								</button>
							</form>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-muted-foreground text-ceter">Handlelisten til Hyggkom er tom :(</p>
		{/if}
	</div>

	<Button class="mt-auto" variant="secondary" href="/for-studenter/handleliste"
		>Til handlelisten</Button
	>
</div>
