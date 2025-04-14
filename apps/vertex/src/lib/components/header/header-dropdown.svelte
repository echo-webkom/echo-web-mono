<script lang="ts">
  import { getHeaderContext } from "$lib/context/header";

  let headerCtx = getHeaderContext();
</script>

{#if headerCtx.routes.length > 0}
  <nav class="flex items-center gap-4 p-4">
    <menu class="flex gap-4">
      {#each headerCtx.routes as route}
        <li>
          <a class="p-2 rounded-md" href={route.href}>{route.title}</a>
        </li>
      {/each}
    </menu>
  </nav>
{/if}
