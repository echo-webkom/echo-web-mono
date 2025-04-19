<script lang="ts">
	import removeMd from 'remove-markdown';
	import type { PageData } from '../$types';
	import { page } from '$app/state';
	import { isBoard } from '@echo-webkom/lib';

	let data = $derived(page.data as PageData);
	let posts = $derived(data.posts);
</script>

<ul>
	{#each posts as post}
		<li class="relative flex flex-col h-[150px]">
			<a
				href="/for-studenter/innlegg/{post.slug}"
				class="flex flex-col justify-center group h-full gap-4 px-4 hover:bg-muted"
			>
				<div class="flex items-center gap-4">
					<div>
						<div class="mb-2">
							<h3 class="font-semibold group-hover:underline">{post.title}</h3>
							{#if post.authors}
								<p class="text-xs text-muted-foreground">
									Av {post.authors
										?.map((author) => (isBoard(author.name) ? 'Hovedstyret' : author.name))
										.join(', ')}
								</p>
							{/if}
						</div>
						<p class="text-sm text-muted-foreground italic line-clamp-2">
							{removeMd(post.body)}
						</p>
					</div>
				</div>
			</a>

			<p class="text-xs absolute top-4 right-4 text-muted-foreground">
				{new Date(post._createdAt).toLocaleDateString('nb-NO', {
					day: '2-digit',
					month: 'long'
				})}
			</p>
		</li>
	{/each}
</ul>
