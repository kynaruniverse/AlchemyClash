import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// ScrollArea Root (with optional parchment background)
// ----------------------------------------------------------------------

export interface ScrollAreaProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  /** Visual variant of the scrollbar */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Apply a parchment background to the scroll area */
  parchment?: boolean;
}

const scrollbarVariantStyles = {
  default: "bg-gold/40 hover:bg-gold/60",
  alchemy: "bg-gold/60 hover:bg-gold/80",
  nature: "bg-moss/50 hover:bg-moss/70",
  magic: "bg-violet-magic/50 hover:bg-violet-magic/70",
};

function ScrollArea({
  className,
  children,
  variant = "default",
  parchment = false,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        "relative",
        parchment && "bg-parchment/30 rounded-md border border-gold/20",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar variant={variant} />
      <ScrollAreaPrimitive.Corner className="bg-gold/10 border-t border-l border-gold/20 rounded-bl-sm" />
    </ScrollAreaPrimitive.Root>
  );
}

// ----------------------------------------------------------------------
// ScrollBar (with theming)
// ----------------------------------------------------------------------

export interface ScrollBarProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  variant?: "default" | "alchemy" | "nature" | "magic";
}

function ScrollBar({
  className,
  orientation = "vertical",
  variant = "default",
  ...props
}: ScrollBarProps) {
  const thumbStyles = scrollbarVariantStyles[variant];

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full transition-all duration-200",
          thumbStyles
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };