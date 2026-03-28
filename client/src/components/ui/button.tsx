import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Custom theme tokens (from index.css)
const theme = {
  gold: "oklch(0.72 0.12 75)",
  goldLight: "oklch(0.85 0.10 80)",
  ink: "oklch(0.22 0.03 60)",
  moss: "oklch(0.48 0.08 145)",
  violet: "oklch(0.55 0.12 295)",
  clay: "oklch(0.48 0.12 35)",
};

const buttonVariants = cva(
  // Base: use Cinzel font, consistent sizing, and transition
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0",
  {
    variants: {
      variant: {
        // --- Standard variants (enhanced for the manuscript theme) ---
        default:
          "bg-gradient-to-r from-gold to-gold/80 text-ink shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-clay text-white hover:bg-clay/90 shadow-sm hover:shadow-md",
        outline:
          "border border-gold/50 text-ink bg-parchment/50 hover:bg-gold/10 hover:border-gold",
        secondary:
          "bg-parchment-dark/20 text-ink hover:bg-parchment-dark/30",
        ghost:
          "text-ink/70 hover:text-ink hover:bg-gold/10",
        link:
          "text-gold underline-offset-4 hover:underline",

        // --- New alchemy‑themed variants ---
        alchemy:
          "bg-gradient-to-r from-gold to-gold/80 text-ink shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden",
        nature:
          "bg-gradient-to-r from-moss to-moss/80 text-ink shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        magic:
          "bg-gradient-to-r from-violet-magic to-violet-magic/80 text-ink shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Optional loading state (displays a spinner) */
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        // Optional shimmer effect for alchemy variant (only on hover)
        variant === "alchemy" &&
          "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-500 after:ease-out"
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin size-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };