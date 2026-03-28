import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// RadioGroup Root (with theming)
// ----------------------------------------------------------------------

export interface RadioGroupProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  /** Visual variant of the radio group container and items */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top of the container */
  decorative?: boolean;
}

const containerVariantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

const itemVariantStyles = {
  default: {
    border: "border-gold/40",
    fill: "fill-gold",
    hover: "hover:border-gold hover:bg-gold/10",
  },
  alchemy: {
    border: "border-gold/60",
    fill: "fill-gold",
    hover: "hover:border-gold hover:bg-gold/20",
  },
  nature: {
    border: "border-moss/50",
    fill: "fill-moss",
    hover: "hover:border-moss hover:bg-moss/10",
  },
  magic: {
    border: "border-violet-magic/50",
    fill: "fill-violet-magic",
    hover: "hover:border-violet-magic hover:bg-violet-magic/10",
  },
};

function RadioGroup({
  className,
  variant = "default",
  decorative = false,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div className="relative">
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        className={cn(
          "relative grid gap-3 rounded-md border p-4 transition-all duration-200",
          containerVariantStyles[variant],
          decorative && "pt-8", // space for ribbon
          className
        )}
        {...props}
      >
        {/* Decorative gold top ribbon */}
        {decorative && (
          <>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gold/60 rounded-full" />
            <div className="absolute top-0 left-4 w-8 h-[2px] bg-gold/30" />
            <div className="absolute top-0 right-4 w-8 h-[2px] bg-gold/30" />
          </>
        )}
        {children}
      </RadioGroupPrimitive.Root>
    </div>
  );
}

// ----------------------------------------------------------------------
// RadioGroupItem (enhanced)
// ----------------------------------------------------------------------

function RadioGroupItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  variant?: "default" | "alchemy" | "nature" | "magic";
}) {
  const styles = itemVariantStyles[variant];

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base styles
        "aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-gold/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Variant border and hover
        styles.border,
        styles.hover,
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
        asChild
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <CircleIcon className={cn("absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2", styles.fill)} />
        </motion.div>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };