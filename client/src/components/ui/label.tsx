import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Label with theming
// ----------------------------------------------------------------------

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {
  /** Visual variant of the label */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a subtle gold decoration (e.g., a small fleur‑de‑lis or dot) */
  decorative?: boolean;
}

const labelVariantStyles = {
  default: "text-ink",
  alchemy: "text-gold",
  nature: "text-moss",
  magic: "text-violet-magic",
};

function Label({
  className,
  variant = "default",
  decorative = false,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Base (original)
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // Theme (typography + color)
        "font-cinzel tracking-wide",
        labelVariantStyles[variant],
        // Decorative: add a small gold fleur‑de‑lis before the label
        decorative && "before:content-['⚜️'] before:mr-1 before:text-gold/60 before:text-xs",
        className
      )}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  );
}

export { Label };