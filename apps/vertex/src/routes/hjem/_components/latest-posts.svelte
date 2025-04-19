<script lang="ts">
	import removeMd from 'remove-markdown';
	import type { PageData } from '../$types';

	type Props = {
		posts: PageData['posts'];
	};

	let { posts }: Props = $props();
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
						<h3 class="font-semibold group-hover:underline mb-2">{post.title}</h3>
						<p class="text-sm text-muted-foreground italic line-clamp-3">
							{removeMd(post.body)}
						</p>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
