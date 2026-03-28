import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /** Visual variant of the checkbox */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Size variant */
  size?: "sm" | "default" | "lg";
}

const sizeStyles = {
  sm: "size-3.5 rounded-[3px]",
  default: "size-4 rounded-[4px]",
  lg: "size-5 rounded-[5px]",
};

const variantStyles = {
  default: {
    unchecked: "border-gold/40 bg-parchment/80",
    checked: "bg-gold text-ink border-gold",
  },
  alchemy: {
    unchecked: "border-gold/60 bg-gold/5",
    checked: "bg-gold text-ink border-gold",
  },
  nature: {
    unchecked: "border-moss/60 bg-moss/5",
    checked: "bg-moss text-ink border-moss",
  },
  magic: {
    unchecked: "border-violet-magic/60 bg-violet-magic/5",
    checked: "bg-violet-magic text-ink border-violet-magic",
  },
};

function Checkbox({
  className,
  variant = "default",
  size = "default",
  checked,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const styles = variantStyles[variant];
  const isChecked = checked === true;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-state={isChecked ? "checked" : "unchecked"}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer relative shrink-0 rounded-[4px] border shadow-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeStyles[size],
        isChecked
          ? cn(
              styles.checked,
              "hover:brightness-110 active:scale-95"
            )
          : cn(
              styles.unchecked,
              "hover:border-gold hover:bg-gold/10 active:scale-95"
            ),
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isChecked && (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CheckboxPrimitive.Indicator
              data-slot="checkbox-indicator"
              className="flex items-center justify-center text-current"
            >
              <CheckIcon
                className={cn(
                  "transition-transform",
                  size === "sm" && "size-2.5",
                  size === "default" && "size-3.5",
                  size === "lg" && "size-4"
                )}
              />
            </CheckboxPrimitive.Indicator>
          </motion.div>
        )}
      </AnimatePresence>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };