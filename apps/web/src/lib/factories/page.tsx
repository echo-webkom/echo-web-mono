import type { NextPage } from "next";
import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";

import { isWebkom } from "../memberships";

/*
 * This is a factory function that creates a page component.
 *
 * Example usage:
 *
 * export const createPage(() => {
 *   return <div>
 *     <h1>Hei</h1>
 *   </div>
 * })
 *
 * export const createPage<{ slug: string }>(({ slug }) => {
 *  return <div>
 *     <h1>{slug}</h1>
 *   </div>
 * })
 */
export const createPage = <
  TProps extends Record<string, unknown>,
  TPayload extends Record<string, unknown>,
>(
  Component: NextPage<TProps>,
  payload?: TPayload,
) => {
  return <Component {...(payload as TProps)} />;
};

export const createAuthedPage = <P extends Record<string, unknown>>(
  Component: NextPage<P>,
  options?: {
    redirectTo?: string;
  },
) => {
  return async () => {
    const user = await auth();

    if (!user) {
      return redirect(options?.redirectTo ?? "/");
    }

    return createPage(Component);
  };
};

export const createWebkomPage = <P extends Record<string, unknown>>(
  Component: NextPage<P>,
  options?: {
    redirectTo?: string;
  },
) => {
  return async () => {
    const user = await auth();

    if (!user) {
      return redirect(options?.redirectTo ?? "/");
    }

    if (!isWebkom(user)) {
      return redirect(options?.redirectTo ?? "/");
    }

    return createPage(Component);
  };
};
