import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const switchVariantStyles = {
  default: {
    checked: "bg-gold",
    unchecked: "bg-gold/20",
    thumb: "bg-parchment",
  },
  alchemy: {
    checked: "bg-gold",
    unchecked: "bg-gold/30",
    thumb: "bg-parchment",
  },
  nature: {
    checked: "bg-moss",
    unchecked: "bg-moss/20",
    thumb: "bg-parchment",
  },
  magic: {
    checked: "bg-violet-magic",
    unchecked: "bg-violet-magic/20",
    thumb: "bg-parchment",
  },
};

function Switch({
  className,
  variant = "default",
  ...props
}: SwitchProps) {
  const styles = switchVariantStyles[variant];

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-gold data-[state=unchecked]:bg-gold/20",
        styles.checked && `data-[state=checked]:${styles.checked}`,
        styles.unchecked && `data-[state=unchecked]:${styles.unchecked}`,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          styles.thumb
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };