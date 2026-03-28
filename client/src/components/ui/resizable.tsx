import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// Panel Group (with theming)
// ----------------------------------------------------------------------

export interface ResizablePanelGroupProps
  extends React.ComponentProps<typeof ResizablePrimitive.PanelGroup> {
  /** Visual variant of the panel group container */
  variant?: "default" | "alchemy" | "nature" | "magic";
  /** Add a decorative gold ribbon at the top */
  decorative?: boolean;
}

const groupVariantStyles = {
  default: "bg-parchment/80 border-gold/30 text-ink shadow-sm",
  alchemy: "bg-gold/5 border-gold/50 text-ink shadow-md",
  nature: "bg-moss/5 border-moss/40 text-ink shadow-md",
  magic: "bg-violet-magic/5 border-violet-magic/40 text-ink shadow-md",
};

function ResizablePanelGroup({
  className,
  variant = "default",
  decorative = false,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "relative flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        "rounded-md border transition-all duration-200",
        groupVariantStyles[variant],
        decorative && "pt-6", // space for ribbon
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
    </ResizablePrimitive.PanelGroup>
  );
}

// ----------------------------------------------------------------------
// Panel (unchanged, but can be themed via parent)
// ----------------------------------------------------------------------
function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

// ----------------------------------------------------------------------
// Handle (with gold styling)
// ----------------------------------------------------------------------

export interface ResizableHandleProps
  extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
  withHandle?: boolean;
  /** Additional styling variant for the handle */
  variant?: "default" | "alchemy" | "nature" | "magic";
}

const handleVariantStyles = {
  default: "bg-gold/40 hover:bg-gold/60 focus-visible:ring-gold/50",
  alchemy: "bg-gold/60 hover:bg-gold/80 focus-visible:ring-gold/60",
  nature: "bg-moss/50 hover:bg-moss/70 focus-visible:ring-moss/50",
  magic: "bg-violet-magic/50 hover:bg-violet-magic/70 focus-visible:ring-violet-magic/50",
};

function ResizableHandle({
  withHandle,
  className,
  variant = "default",
  ...props
}: ResizableHandleProps) {
  const styles = handleVariantStyles[variant];

  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        // Base handle styling
        "relative flex w-px items-center justify-center transition-all duration-200",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 after:rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        // Variant colors
        styles,
        // Orientation-specific adjustments
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full",
        "data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2",
        "[&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex h-4 w-3 items-center justify-center rounded-xs border transition-all duration-200",
            "bg-parchment/80 border-gold/40 text-gold/70",
            "hover:bg-parchment hover:border-gold hover:text-gold"
          )}
        >
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };