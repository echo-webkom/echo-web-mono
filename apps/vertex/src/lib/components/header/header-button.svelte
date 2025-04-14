<script lang="ts">
  import { cn } from "$lib/cn";
  import { getHeaderContext, setHeaderContext } from "$lib/context/header";
  import { ChevronDown } from "lucide-svelte";
import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = HTMLButtonAttributes & {
    links: Array<{ title: string, description: string, href: string}>
    children: Snippet;
  }

  let { children, links, class: className, ...props }: Props = $props();

  let isOpen = $state(false);
  let headerCtx = getHeaderContext();

  const handleClick = () => {
    isOpen = !isOpen;

    if (isOpen) {
      headerCtx.routes = links;
    } else {
      headerCtx.routes = [];
    }
  }
</script>

<li>
  <button
    onclick={handleClick}
    class={["font-medium flex items-center gap-2", className]}
    {...props}
    >{@render children()}
    <ChevronDown class={cn("size-4", isOpen ? "rotate-180" : "rotate-0")} /></button
  >
</li>
