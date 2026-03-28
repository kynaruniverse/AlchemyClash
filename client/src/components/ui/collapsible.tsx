import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CollapsibleProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  /** Visual variant of the collapsible container */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top */
  decorative?: boolean;
  /** Enable smooth Framer Motion animations for content (default: true) */
  animate?: boolean;
}

const variantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

function Collapsible({
  className,
  variant = "default",
  decorative = false,
  animate = true,
  children,
  ...props
}: CollapsibleProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn(
        "relative rounded-xl border transition-all duration-200",
        variantStyles[variant],
        decorative && "pt-6",
        className
      )}
      {...props}
    >
      {/* Decorative gold ribbon */}
      {decorative && (
        <>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gold/60 rounded-full" />
          <div className="absolute top-0 left-4 w-8 h-[2px] bg-gold/30" />
          <div className="absolute top-0 right-4 w-8 h-[2px] bg-gold/30" />
        </>
      )}
      {children}
    </CollapsiblePrimitive.Root>
  );
}

function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 text-left font-cinzel text-sm font-medium transition-all duration-200",
        "hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        "data-[state=open]:text-gold",
        className
      )}
      {...props}
    >
      {children}
      {/* Optional indicator could be added here, but we keep it simple */}
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
}

interface CollapsibleContentProps
  extends React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> {
  /** Enable smooth Framer Motion animations (overrides parent) */
  animate?: boolean;
}

function CollapsibleContent({
  className,
  children,
  animate = true,
  ...props
}: CollapsibleContentProps) {
  // If animations are enabled, use Framer Motion with AnimatePresence
  if (animate) {
    return (
      <CollapsiblePrimitive.CollapsibleContent asChild {...props}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "overflow-hidden px-4 pb-4 font-lora text-ink/80",
            className
          )}
        >
          {children}
        </motion.div>
      </CollapsiblePrimitive.CollapsibleContent>
    );
  }

  // Fallback to standard Radix content (uses CSS transitions)
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden px-4 pb-4 font-lora text-ink/80",
        "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };