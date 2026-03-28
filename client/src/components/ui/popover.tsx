import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Root, Trigger, Anchor (unchanged)
// ----------------------------------------------------------------------

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

// ----------------------------------------------------------------------
// PopoverContent (with theming)
// ----------------------------------------------------------------------

export interface PopoverContentProps
  extends React.ComponentProps<typeof PopoverPrimitive.Content> {
  /** Visual variant of the popover content */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top */
  decorative?: boolean;
}

const variantStyles = {
  default: "bg-parchment/95 border-gold/30 text-ink shadow-lg",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-lg",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-lg",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-lg",
};

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  variant = "default",
  decorative = false,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Base layout and animations (original)
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Theme
          variantStyles[variant],
          decorative && "pt-8", // space for decorative ribbon
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
        {props.children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };