"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center font-semibold justify-center rounded-full border transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary border-primary-dark text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-destructive border-destructive-dark text-destructive-foreground hover:bg-destructive/90",
        outline: "hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary border-secondary-dark text-secondary-foreground hover:bg-secondary-hover",
        ghost: "hover:bg-accent border-transparent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-5",
        sm: "h-9 px-4",
        lg: "h-11 px-9",
        icon: "h-9 w-9",
        "icon-lg": "h-12 w-12",
        "icon-sm": "h-6 w-6",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, type, asChild = false, ...props }, ref) => {
    const Component = asChild ? SlotPrimitive.Root : "button";

    return (
      <Component
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        type={type ?? "button"}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
