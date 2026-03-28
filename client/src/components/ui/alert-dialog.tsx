import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Custom theme tokens (already defined in index.css)
const theme = {
  parchment: "oklch(0.93 0.04 80)",
  parchmentDark: "oklch(0.82 0.05 75)",
  gold: "oklch(0.72 0.12 75)",
  ink: "oklch(0.22 0.03 60)",
  clay: "oklch(0.48 0.12 35)",
  moss: "oklch(0.48 0.08 145)",
};

// ----- Root -----
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>): JSX.Element {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

// ----- Trigger -----
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>): JSX.Element {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

// ----- Portal -----
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>): JSX.Element {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

// ----- Overlay -----
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): JSX.Element {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

// ----- Content (the main dialog) -----
function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>): JSX.Element {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          // Base
          "fixed top-[50%] left-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          // Parchment look
          "bg-parchment/95 backdrop-blur-sm",
          "border border-gold/40 rounded-lg shadow-2xl",
          // Inner spacing
          "p-6 gap-4",
          // Animations
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "duration-200",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
        {...props}
      >
        {/* Decorative top border (like a scroll header) */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gold/40 rounded-full" />
        <div className="absolute top-0 left-4 w-8 h-[2px] bg-gold/20" />
        <div className="absolute top-0 right-4 w-8 h-[2px] bg-gold/20" />

        {/* Main content */}
        <div className="space-y-4">{children}</div>

        {/* Optional decorative ink splatter at bottom right */}
        <div className="absolute bottom-2 right-2 text-gold/20 text-xs select-none">
          ⚜️
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

// ----- Header -----
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col gap-1 text-center sm:text-left border-b border-gold/20 pb-3",
        className
      )}
      {...props}
    />
  );
}

// ----- Footer -----
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">): JSX.Element {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 pt-3",
        className
      )}
      {...props}
    />
  );
}

// ----- Title -----
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>): JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "text-lg font-semibold font-cinzel tracking-wide",
        "text-ink bg-gradient-to-r from-gold/80 to-gold/0 bg-clip-text",
        className
      )}
      {...props}
    />
  );
}

// ----- Description -----
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>): JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "text-sm font-lora text-ink/80 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

// ----- Action Button (Confirm) -----
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>): JSX.Element {
  return (
    <AlertDialogPrimitive.Action
      className={cn(
        buttonVariants({ variant: "default" }),
        // Override with alchemy style
        "bg-gradient-to-r from-gold to-gold/80 text-ink hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

// ----- Cancel Button -----
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>): JSX.Element {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        buttonVariants({ variant: "outline" }),
        // Override to match alchemy
        "border-gold/50 text-ink/80 hover:bg-gold/10 hover:border-gold",
        className
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};