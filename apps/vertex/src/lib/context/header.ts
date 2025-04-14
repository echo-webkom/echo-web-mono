import { setContext, getContext } from "svelte";

const HEADER_CONTEXT_KEY = "header-context";

export type HeaderContext = {
  routes: Array<{ title: string, description: string, href: string}>
}

export const setHeaderContext = (context: HeaderContext) => {
  setContext(HEADER_CONTEXT_KEY, context);
}

export const getHeaderContext = () =>  {
  const context = getContext<HeaderContext>(HEADER_CONTEXT_KEY);
  if (!context) {
    throw new Error("Header context not found");
  }

  return context;
}