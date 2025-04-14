<script lang="ts">
  import Logo from "$lib/assets/images/echo-logo.png";
  import { setHeaderContext } from "$lib/context/header";
  import HeaderButton from "./header-button.svelte";
  import HeaderLink from "./header-link.svelte";
  import HeaderDropdown from "./header-dropdown.svelte";

  let context = $state({
    routes: []
  })

  setHeaderContext(context);
</script>

<div class="border-b">
  <header class="flex items-center mx-auto max-w-7xl justify-between p-4">
    <div class="flex items-center gap-8">
      <img src={Logo} class="size-14" alt="echo Logo" />

      <menu class="flex gap-4">
        <HeaderLink href="/">Hjem</HeaderLink>
        <HeaderButton
          links={[
            {
              title: "For Studenter",
              description: "For Studenter",
              href: "/student",
            },
            {
              title: "For Bedrifter",
              description: "For Bedrifter",
              href: "/bedrift",
            },
          ]}>For Studenter</HeaderButton
        >
        <HeaderButton
          links={[
            {
              title: "For Studenter",
              description: "For Studenter",
              href: "/student",
            },
            {
              title: "For Bedrifter",
              description: "For Bedrifter",
              href: "/bedrift",
            },
          ]}>For Bedrifter</HeaderButton
        >
        <HeaderButton
          links={[
            {
              title: "For Studenter",
              description: "For Studenter",
              href: "/student",
            },
            {
              title: "For Bedrifter",
              description: "For Bedrifter",
              href: "/bedrift",
            },
          ]}>Om echo</HeaderButton
        >
      </menu>
    </div>

    <div class="flex items-center gap-4">
      <button class="btn btn-primary">Logg inn</button>
    </div>
  </header>

  <HeaderDropdown />
</div>
