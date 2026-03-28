import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

export interface SeparatorProps
  extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const separatorVariantStyles = {
  default: "bg-gold/40",
  alchemy: "bg-gold/60",
  nature: "bg-moss/40",
  magic: "bg-violet-magic/40",
};

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "default",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        separatorVariantStyles[variant],
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };