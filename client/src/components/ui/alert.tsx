import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Info, Sparkles, Leaf, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// Custom theme tokens (already defined in index.css)
const theme = {
  parchment: "oklch(0.93 0.04 80)",
  ink: "oklch(0.22 0.03 60)",
  gold: "oklch(0.72 0.12 75)",
  moss: "oklch(0.48 0.08 145)",
  violet: "oklch(0.55 0.12 295)",
  clay: "oklch(0.48 0.12 35)",
};

const alertVariants = cva(
  // Base styles – parchment surface with subtle noise
  "relative w-full rounded-lg border p-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-1 items-start",
  {
    variants: {
      variant: {
        // Default: subtle alchemy look
        default: "bg-parchment/80 text-ink border-gold/30 shadow-sm",
        // Destructive: clay red with ink
        destructive: "bg-clay/10 text-destructive border-clay/40",
        // Alchemy: gold gradient border, warm glow
        alchemy: "bg-parchment/90 text-ink border-gold shadow-[0_0_12px_rgba(212,168,67,0.2)]",
        // Nature: moss green accents
        nature: "bg-parchment/80 text-ink border-moss/40 shadow-sm",
        // Magic: violet magic aura
        magic: "bg-parchment/80 text-ink border-violet-magic/40 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Optional icon to display (overrides default icon) */
  icon?: React.ReactNode;
  /** Whether to show a decorative ink flourish (default: true) */
  decorative?: boolean;
}

function Alert({
  className,
  variant = "default",
  icon,
  decorative = true,
  children,
  ...props
}: AlertProps) {
  // Default icons per variant
  const defaultIcon = {
    default: <Info className="size-4 text-gold" />,
    destructive: <AlertCircle className="size-4 text-clay" />,
    alchemy: <Sparkles className="size-4 text-gold" />,
    nature: <Leaf className="size-4 text-moss" />,
    magic: <Wand2 className="size-4 text-violet-magic" />,
  }[variant];

  const showIcon = icon ?? defaultIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {/* Icon */}
      {showIcon && (
        <span className="flex items-center justify-center mt-0.5">
          {showIcon}
        </span>
      )}

      {/* Content */}
      <div className="space-y-1">
        {children}
      </div>

      {/* Decorative flourish (ink blot / gold dot) */}
      {decorative && (
        <div className="absolute bottom-1 right-2 text-gold/20 text-xs select-none pointer-events-none">
          ⚜️
        </div>
      )}
    </motion.div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium font-cinzel tracking-wide",
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-ink/80 font-lora text-sm leading-relaxed [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };