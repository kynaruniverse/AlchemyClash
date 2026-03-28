import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// Custom theme classes (assumes they exist in global CSS)
// bg-gold, text-ink, border-gold, bg-moss, bg-violet-magic, etc.

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
  {
    variants: {
      variant: {
        // Standard variants (enhanced)
        default:
          "border-transparent bg-gradient-to-r from-gold to-gold/80 text-ink shadow-sm hover:shadow-md hover:-translate-y-0.5",
        secondary:
          "border-transparent bg-parchment-dark/20 text-ink hover:bg-parchment-dark/30",
        destructive:
          "border-transparent bg-clay text-white hover:bg-clay/90",
        outline:
          "border-gold/40 bg-parchment/50 text-ink hover:bg-gold/10",

        // Alchemy‑themed variants
        alchemy:
          "border-gold/40 bg-gold/10 text-ink hover:bg-gold/20",
        nature:
          "border-moss/40 bg-moss/10 text-ink hover:bg-moss/20",
        magic:
          "border-violet-magic/40 bg-violet-magic/10 text-ink hover:bg-violet-magic/20",
      },
      size: {
        sm: "px-1.5 py-0.25 text-[0.6rem]",
        default: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /** Optional icon (React node) to display before the text */
  icon?: React.ReactNode;
  /** Whether to enable hover animation (default: true) */
  animate?: boolean;
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  icon,
  animate = true,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  const classes = cn(badgeVariants({ variant, size }), className);

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </>
  );

  if (animate) {
    return (
      <motion.span
        whileHover={{ y: -1, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={classes}
        {...props}
      >
        {content}
      </motion.span>
    );
  }

  return (
    <Comp className={classes} {...props}>
      {content}
    </Comp>
  );
}

export { Badge, badgeVariants };