"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { track } from "@vercel/analytics";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:ring-zinc-900",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-500",
        outline:
          "border border-line bg-transparent text-foreground hover:bg-surface focus-visible:ring-zinc-500",
        ghost: "text-zinc-900 hover:bg-zinc-100 focus-visible:ring-zinc-500",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  // Stable, English-only analytics id — kept independent of the (localized)
  // button label so events group consistently in Analytics across languages.
  // When set, a click fires a `button_click` event `{ id, ...trackProps }`.
  trackId?: string;
  trackProps?: Record<string, string | number | boolean>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, trackId, trackProps, onClick, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (trackId) {
        track("button_click", { id: trackId, ...trackProps });
      }
      onClick?.(event);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
